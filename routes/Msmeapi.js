const express = require('express');
const router = express.Router();
const storage = require('../cloudinaryStorage');
require('dotenv').config();

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Msme = require('../models/Msme');
const User = require('../models/user');
const multer = require("multer");
const upload = multer();


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAYKEY_ID,
    key_secret: process.env.RAZORPAYKEY_SECRET
});

router.post('/register-msme', upload.none(), async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { body } = req;
        const userId = body.userId;

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
            amount: 9000000,
            currency: 'INR',
            receipt: 'rcpt_' + Date.now()
        });

        // Parse the declaration object properly
        const declarationData = parseIfString(body.declaration);
        console.log("Parsed declaration data:", declarationData);

        const msme = new Msme({
            userId: userId, // Add userId to the main object
            basic_info: parseIfString(body.basic_info),
            contact_info: parseIfString(body.contact_info),
            cluster_details: parseIfString(body.cluster_details),
            documents: {
                issues: parseIfString(body.documents)?.issues || []
            },
            declaration: {
                signature: declarationData.signature,
                declaration_date: declarationData.declaration_date,
                declared: declarationData.declared
            },
            payment: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                status: 'pending'
            }
        });

        console.log("MSME object before save:", JSON.stringify(msme, null, 2));

        await msme.save();

        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                user.msme_registration = user.msme_registration || [];
                user.msme_registration.push(msme._id);
                await user.save();
            }
        }

        res.status(200).json({ orderId: order.id, key: razorpay.key_id, message: "Order created successfully" });
    } catch (err) {
        console.error("Full error:", err);
        res.status(500).json({ message: "Error saving MSME data", error: err.message });
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
        const entry = await Msme.findOne({ 'payment.orderId': orderId });

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
    } catch (err) {
        console.error('Payment verification error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
