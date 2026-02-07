const { db } = require("../utils/db");

const {SENDER_EMAIL} = process.env;

async function makeMailEntry(email=null, subject=null, htmlBody=null)
{
    try{
        if(!email || !htmlBody)return false;
        const payload = 
        {
            time:new Date(),
            email:email,
            subject:subject,
            htmlBody:htmlBody,
            fromEmail:SENDER_EMAIL
        }

        await db.sentBox.insertOne(payload);
        return true;
    }catch(err){
        return false;
    }
}


module.exports = { makeMailEntry }  