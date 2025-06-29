const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = require('../cloudinaryStorage');
const upload = multer({ storage });
const user = require('../models/User');

const Firm = require('../models/Firm');

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

            res.status(201).json({ message: 'Firm registered successfully', firm });
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


module.exports = router;
