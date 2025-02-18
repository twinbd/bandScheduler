const nodemailer = require("nodemailer");

const sendMail = async function ({ to, subject, text, html }) {
    console.log(to, subject, text, html);
    const mailTransport = nodemailer.createTransport({
        host: process.env.AWS_SES_REGION, // SES SMTP endpoint
        port: 587, // TLS port
        secure: false, // Use STARTTLS
        auth: {
            user: process.env.AWS_SES_SMTP_USER, // SES SMTP username
            pass: process.env.AWS_SES_SMTP_PASS, // SES SMTP password
        },
    });
    await mailTransport.sendMail({
        from: `"Band Scheduler" <no-reply@band-schedule.com>`,
        to,
        subject,
        text,
        html,
    });
}

module.exports = sendMail;