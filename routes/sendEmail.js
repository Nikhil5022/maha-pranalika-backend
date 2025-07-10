const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'mvishleshana2002@gmail.com',
        pass: 'xmkvvvxqsukhvbvw'
    }
});
/*
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.email',
    port: 465,
    auth: {
        user: accounts.user,
        pass: account.pass
    }
});*/
module.exports = {
    sendVerificationEmail: async (senderAddress, link) => {
        let error = false;
        try {
            await transporter.sendMail({
                from: '"mahapranalika" mvishleshana2002@gmail.com',
                to: senderAddress,
                subject: "verify email",
                html: `Please verify your email by clicking <a href=${link}> here </a> <br/>
    This token is only valid for 7 days`
            });
        }
        catch (e) {
            error = true;
        }
        return error;
    },
    sendForgotPasswordEmail: async (senderAddress, link) => {
        let error = false;
        try {
            await transporter.sendMail({
                from: '"mahapranalika" mvishleshana2002@gmail.com',
                to: senderAddress,
                subject: "Reset Password",
                html: `Please Reset your password by clicking <a href=${link}> here </a> <br/>
    This link is only valid for 7 days`
            });
        }
        catch (e) {
            error = true;
        }
        return error;
    }
}