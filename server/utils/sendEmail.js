const nodemailer = require("nodemailer");
const { makeMailEntry } = require("../controllers/mail.controller");

async function sendEmail(toEmail, subject, htmlBody) 
{
    try 
    {
        const ist = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" })
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
            port: 587,
            secure: false,
        }); 

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: toEmail,
            subject: subject,
            html: htmlBody,
        };

        const info = await transporter.sendMail(mailOptions);  
        console.log("✅ Email sent successfully:", info.response);

        await makeMailEntry(toEmail, subject, htmlBody);
        return info.response;
    } 
    catch (error) 
    {
        console.error("❌ Error sending email:", error);
        throw new Error("Email sending failed");
    }
}

module.exports = sendEmail;