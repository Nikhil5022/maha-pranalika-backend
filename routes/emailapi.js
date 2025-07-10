const jwt = require('jsonwebtoken');
const User = require('../models/user');
const express = require('express');
const router = express.Router();
const JWT_SECRET = "your_jwt_secret_key";
router.get('/verify', async (req,res)=>{
    const {token} = req.query;
    console.log("token:", token);
    
   if(!token){
    return res.status(404).json({ success: false, message: 'Invalid Token!' });
   }
   let decodedToken;
   try{
    decodedToken=jwt.verify(token,JWT_SECRET);
   }
   catch (err){
    return res.status(400).json({ success: false, message: 'Invalid Token!', error: err });
   }
  
   const oldUser = await User.findOne({email: decodedToken.email});
   if(!oldUser){
    return res.status(400).json({success:false, message:"User not found!"})
   }
   oldUser.verified=true;
   await oldUser.save();
   res.status(200).json({success:true, "message":"You are verified successfully"})
})
module.exports=router;