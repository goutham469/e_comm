const express = require("express")
const CORS = require("cors");
require("dotenv").config();

const { connectDB } = require("./utils/db");
const { enrollUser } = require("./controllers/user.controller");
const { userRouter } = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");
const { publicRoute } = require("./routes/public.route");
const { requestCsvLogger } = require("./middlewares/requestCsvLogger");
const { security, isAdmin } = require("./middlewares/security");

const app = express();
app.use(express.json());


// app SETTING
const { REQUEST_LOGGER, STRICT_CORS, FRONTEND_URL } = process.env;

if( REQUEST_LOGGER == 'TRUE' ){ app.use( requestCsvLogger ) }
app.use( CORS() ) 

app.get("/", (req,res) =>  res.send("server[ e-comm ] running ..."));

app.use("/public", publicRoute)
app.use("/user",(req,res,next) => security(req, res, next), userRouter)
app.use("/admin",
    (req,res,next) => { security(req, res, next) },
    (req, res, next) => { isAdmin(req,res,next) },
     adminRouter)

app.post("/test", async(req,res) => {
    enrollUser( req.body );
})

async function initiateConnection()
{
    await connectDB();
    return "ok"
}

const {PORT} = process.env;
app.listen( PORT, async () => {
    console.log("server listening on port : ", PORT);
    await initiateConnection();
} )