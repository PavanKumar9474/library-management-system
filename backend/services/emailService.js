const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER || "your-email@gmail.com",
                pass: process.env.EMAIL_PASS || "your-app-password",
            },
        });

        const mailOptions = {
            from: `"Library Management System" <${process.env.EMAIL_USER || "your-email@gmail.com"}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // Don't crash if credentials are dummy
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log("Email sent to:", options.email);
        } else {
            console.log("Email Service Mock: Email intended for", options.email);
            console.log("Message:", options.message);
        }
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
