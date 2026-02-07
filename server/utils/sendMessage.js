require("dotenv").config();
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { db } = require("./db");
const { canSendMobileMessage } = require("../middlewares/security");

async function sendSMSMessage(sns, params) {
    const command = new PublishCommand(params);
    try {
        const message = await sns.send(command);
        console.log("✅ Message Sent:", message.MessageId);
        return message;
    } catch (err) {
        console.error("❌ Failed to send SMS:", err);
    }
}

async function sendPhoneMessage(PhoneNumber, message) {
    try{
        if(!PhoneNumber) return { success:false, error:"Invalid phone number" }
        if(!message) return { success:false, error:"Empty message can't be delivered" }
        if( ! await canSendMobileMessage()) return { success:false, error:"Servers are busy can't send Now", message:"Daily set Limit exceeded" }

        const params = {
            Message: message,
            PhoneNumber: PhoneNumber,  // Or hardcoded '+91xxxxxxxxxx'
            MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                    DataType: 'String',
                    StringValue: 'MyService'  // Must be alphanumeric, ≤ 11 chars
                },
                'AWS.SNS.SMS.SMSType': {
                    DataType: 'String',
                    StringValue: 'Transactional'  // ✅ for OTPs
                }
            }
        };

        const sns = new SNSClient({
            region: "ap-south-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            }
        });

        console.log("Sending to:", process.env.PHONE);
        const messageStatus = await sendSMSMessage(sns, params);

        const payload = { PhoneNumber:PhoneNumber, message:message, time:new Date() }
        await db.mobileMessages.insertOne(payload);
        return { success:true, data:{messageStatus} }
    }catch(err){
        return {success:false, error:err.message}
    }
}

module.exports = { sendPhoneMessage }