const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = require('../cloudinaryStorage');
const upload = multer({ storage });
const user = require('../models/user');
require('dotenv').config();
const { deleteFileFromCloudinary } = require('../cloudinaryHelpers');


const Firm = require('../models/Firm');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAYKEY_ID,
    key_secret: process.env.RAZORPAYKEY_SECRET
});

router.post(
    '/register-firm',
    upload.fields([
        { name: 'panCard' },
        { name: 'aadhaarCard' },
        { name: 'photos' },
        { name: 'addressProofDoc' },
        { name: 'dsc' },
        { name: 'noc' },
        { name: 'signature' }
    ]),
    async (req, res) => {
        try {
            const { body, files } = req;
            const userId = body.userId;

            Object.keys(files).forEach(field => {
                files[field].forEach(file => {
                    console.log(`Uploaded file (${field}):`, {
                        originalname: file.originalname,
                        mimetype: file.mimetype,
                        encoding: file.encoding,
                        path: file.path,
                        size: file.size
                    });
                });
            });


            const parseIfString = (data) => {
                if (!data) return {};
                try {
                    return typeof data === 'string' ? JSON.parse(data) : data;
                } catch (e) {
                    console.error("JSON parsing error:", e.message);
                    return {};
                }
            };

            const order = await razorpay.orders.create({
                amount: 1000000,
                currency: 'INR',
                receipt: 'rcpt_' + Date.now()
            });

            const firm = new Firm({
                basic_details: parseIfString(body.basic_details),
                firm_details: parseIfString(body.firm_details),
                partner_details: parseIfString(body.partner_details),
                documents: {
                    panCard: files?.panCard?.[0]?.path,
                    aadhaarCard: files?.aadhaarCard?.[0]?.path,
                    photos: files?.photos?.[0]?.path,
                    addressProofDoc: files?.addressProofDoc?.[0]?.path,
                    dsc: files?.dsc?.[0]?.path,
                    noc: files?.noc?.[0]?.path
                },
                declaration: {
                    signature: files?.signature?.[0]?.path,
                    name: body['declaration.name'] || '',
                    date: body['declaration.date'] || '',
                    declared: body['declaration.declared'] === 'true'
                },
                payment: {
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    status: 'pending'
                }
            });


            await firm.save();

            if (userId) {
                const foundUser = await user.findById(userId);
                if (foundUser) {
                    foundUser.firm_registration.push(firm._id);
                    await foundUser.save();
                } else {
                    return res.status(404).json({ message: 'User not found' });
                }
            }

            res.status(200).json({ orderId: order.id, key: razorpay.key_id, message: 'Order created successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error saving firm data' });
        }
    }
);

router.post('/getFirms', async (req, res) => {
    try {
        const firms = await Firm.find({});
        if (firms.length === 0) {
            return res.status(404).json({ message: "No firms found" });
        }
        res.status(200).json(firms);
    } catch (error) {
        console.error("Error fetching firms:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post('/verify-payment', async (req, res) => {
    const { orderId, paymentId, signature } = req.body;
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAYKEY_SECRET)
        .update(body)
        .digest("hex");

    const isValid = expectedSignature === signature;
    try {
        const entry = await Firm.findOne({ 'payment.orderId': orderId });

        if (entry) {
            entry.payment.status = isValid ? 'paid' : 'failed';
            entry.payment.paymentId = paymentId;
            entry.payment.signature = signature;
            await entry.save();
        }
        if (isValid) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false, message: 'Signature mismatch' });
        }
    }
    catch (err) {
        console.error('Payment verification error:', err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/resolveFirm', async (req, res) => {
  const {  firmId } = req.body;
  if (!firmId) return res.status(400).json({ message: "userId and firmId are required" });

  try {
    const firm = await Firm.findById(firmId);
    if (!firm) return res.status(404).json({ message: "Firm not found" });

    firm.isResolved = true;
    await firm.save();

    res.status(200).json({ message: "Firm marked as resolved" });
  } catch (err) {
    console.error("Resolve Firm Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.post('/undoResolveFirm', async (req, res) => {
  const {  firmId } = req.body;
  if ( !firmId) return res.status(400).json({ message: "userId and firmId are required" });

  try {
    const firm = await Firm.findById(firmId);
    if (!firm) return res.status(404).json({ message: "Firm not found" });

    firm.isResolved = false;
    await firm.save();

    res.status(200).json({ message: "Firm marked as unresolved" });
  } catch (err) {
    console.error("Undo Resolve Firm Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.delete('/deleteFirm', async (req, res) => {
  const { userId, firmId } = req.body;
  if (!userId || !firmId)
    return res.status(400).json({ message: "userId and firmId are required" });

  try {
    // ✅ Find the firm first
    const firm = await Firm.findById(firmId);
    if (!firm) return res.status(404).json({ message: "Firm not found" });

    // ✅ Collect all firm file URLs from schema
    const fileUrls = [
      firm.documents?.panCard,
      firm.documents?.aadhaarCard,
      firm.documents?.photos,
      firm.documents?.addressProofDoc,
      firm.documents?.dsc,
      firm.documents?.noc,
      firm.declaration?.signature
    ];

    // ✅ Delete each file from Cloudinary
    for (const url of fileUrls) {
      if (url) await deleteFileFromCloudinary(url);
    }

    // ✅ Delete firm record from DB
    await Firm.findByIdAndDelete(firmId);

    // ✅ Remove firm reference from user
    const foundUser = await user.findById(userId);
    if (foundUser) {
      foundUser.firm_registration = foundUser.firm_registration.filter(
        id => id.toString() !== firmId
      );
      await foundUser.save();
    }

    res.status(200).json({ message: "Firm and its files deleted successfully" });

  } catch (err) {
    console.error("Delete Firm Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});



module.exports = router;
