const jwt = require("jsonwebtoken");
const { db } = require("../utils/db");


const { DAILY_MESSAGE_LIMIT, MESSAGE_WINDOW  } = process.env;

function security(req, res, next)
{
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json({
            success: false,
            error: "Authorization header missing"
        });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.json({
            success: false,
            error: "Invalid authorization format"
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded", decoded);
        req.user = decoded;
        req.userId = decoded._id;

        next();
    }catch(err){
        res.send({ success:false, error:"Invalid or expired token." })
    }
}

async function canSendMobileMessage()
{
  try
  {
    const now = new Date();

    /* 1️⃣ Global 1-minute cooldown */
    const lastMessage = await db.mobileMessages.find({})
      .sort({ time: -1 })
      .limit(1).toArray();

    // console.log( lastMessage );

    if (lastMessage)
    {
      const diff = now.getTime() - lastMessage[0].time.getTime();
      if (diff < MESSAGE_WINDOW * 1000)
      {
        return false;
      }
    }

    /* 2️⃣ Start of today (UTC safe) */
    const startOfTodayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0, 0, 0, 0
      )
    );

    /* 3️⃣ Global daily limit */
    const messagesSentToday =
      await db.mobileMessages.countDocuments({
        time: { $gte: startOfTodayUTC }
      });

    if (messagesSentToday >= DAILY_MESSAGE_LIMIT )
    {
      return false;
    }

    return true;
  }
  catch (err)
  {
    console.error("canSendMobileMessage error:", err.message);
    return false;
  }
}

async function canSendEmail(email=null)
{
  try
  {
    if(email == null)return false;

    const lastMail = await db.sentBox.findOne(
      { email },
      { sort: { time: -1 } } // latest mail
    );

    // If no previous email, allow sending
    if (!lastMail) return true;

    const FIVE_MINUTES = 5 * 60 * 1000;

    const now = Date.now();                 // current timestamp
    const lastSent = new Date(lastMail.time).getTime();

    return (now - lastSent) > FIVE_MINUTES;
  }
  catch (err)
  {
    console.error(err);
    return false;
  }
}

async function isAdmin(req,res, next)
{
    const user = req.user;
    if(user.role == 'ADMIN'){ next(); }
    else
    {
        res.send({ success:false, error:"You have no previliges to do this Action..." })
    }
}

module.exports = { security, isAdmin, canSendMobileMessage, canSendEmail }