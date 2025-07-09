const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const CibilTraining = require('../models/CibilTraining');
const user=require('../models/user');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: "rzp_test_T8S88fJw8tHj6S",  
  key_secret: "3rPRapQmi94l6ETUJhGSQ9Ew"
});


router.post('/register', async (req, res) => {
  try {
    const formData = req.body;
    console.log(formData);
    const userId=formData.userId;
    console.log("user:",userId);
    const order = await razorpay.orders.create({
      amount: 499900, 
      currency: 'INR',
      receipt: 'rcpt_' + Date.now()
    });

    console.log('Order created:', order);

    const newEntry = new CibilTraining({
      ...formData,
      payment: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: 'pending'
      }
    });



    await newEntry.save();
    console.log(newEntry._id);
   if(userId){
    const foundUser = await user.findById(userId);
    if (foundUser) {
        foundUser.cibil_training.push(newEntry._id);
        await foundUser.save();
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
   
  }
    res.status(200).json({ orderId: order.id, key: razorpay.key_id, message: 'Order created successfully', entryId: newEntry._id });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Order creation failed' });
  }
});

router.post('/verify-payment', async (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", "3rPRapQmi94l6ETUJhGSQ9Ew")
    .update(body)
    .digest("hex");

  const isValid = expectedSignature === signature;

  try {
    const entry = await CibilTraining.findOne({ 'payment.orderId': orderId });

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
