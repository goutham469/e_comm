const { ObjectId } = require("mongodb");
const { db } = require("../utils/db");
const { getKolkataTime, hashPassword, generatePassword, generateOTP } = require("../utils/helpers");
const bcrypt = require("bcrypt");
const { makeAdmin, blockUser } = require("./admin.controller");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { acccountCreationTemplate } = require("../templates/account-creation.template");
const { otpLoginTemplate } = require("../templates/otp-login.template");
const crypto = require("crypto");
const { sendPhoneMessage } = require("../utils/sendMessage");
const { canSendEmail, canSendMobileMessage } = require("../middlewares/security");

const { FRANCHISE_NAME } = process.env;

async function enrollUser(details) {
  try {
    const { email, name, profile_pic, password } = details;

    if (await checkEmailExistence(email)) {
      return { success: false, error: "This email already exists" };
    }

    const hashedPassword = await hashPassword(password);

    const insertStatus = await db.user.insertOne({
      email,
      password: hashedPassword,
      name,
      profile_pic,
      role:'USER',
      ac_created_on: getKolkataTime()
    });

    // check if this is the first account , if so make him default ADMIN
    if( await db.user.find().count() == 1 ){
        await makeAdmin(email)
    }

    // send email as WELCOME to our platform
    const mailAcknowledgement = await sendEmail( email,  `Welcome to ${FRANCHISE_NAME}`, acccountCreationTemplate( name, email )  );
    console.log( mailAcknowledgement );

    return { success: true, data: { insertStatus ,mailAcknowledgement  } };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function enrollUserByGoogle(details) {
  try {
    const { email, name, picture } = details;
    const profile_pic = picture;
    const password = generatePassword(10);

    if (await checkEmailExistence(email)) {
      const user_details = await userDetails( email );
      const token = generateToken( user_details );

      if( user_details.isBlocked ){
          return { success:false, error:"Your account has been blocked" }
      }else{
        let cartDetails = await getCart( user_details._id )
        if(cartDetails.success){
          cartDetails = cartDetails.data.cartItems
        }else{
          cartDetails = []
        }
        // console.log(cartDetails);

        return { success: true,  data: { user_details:user_details, token:token, cart: cartDetails } };
      }
    }

    const hashedPassword = await hashPassword(password);

    const insertStatus = await db.user.insertOne({
      email,
      password: hashedPassword,
      name,
      profile_pic,
      role:'USER',
      ac_created_on: getKolkataTime()
    });

    // check if this is the first account , if so make him default ADMIN
    if( await db.user.find().count() == 1 ){
        await makeAdmin(email)
    }

    // send email as WELCOME to our platform
    const mailAcknowledgement = await sendEmail( email,  `Welcome to ${FRANCHISE_NAME}`, acccountCreationTemplate( name, email )  );
    console.log( mailAcknowledgement );

    // send email as WELCOME to our platform + send the password
    const user_details = await userDetails( email );
    const token = generateToken( user_details );

    return { success: true, data: { insertStatus:insertStatus , user_details:user_details, token:token }};

  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
}

async function handleLogin(data)
{
  try
  {
    const { email, password } = data;

    const user = await db.user.findOne({ email:String(email).toLocaleLowerCase() });

    if (!user)
    {
      return { success: false, error: "Invalid credentials", code:"INVALID_CREDENTIALS" };
    }

    // 1️⃣ Blocked users cannot login
    if (user.isBlocked)
    {
      return { success: false, error: "Your account has been blocked", code:"ACCOUNT_BLOCKED" };
    }

    // 2️⃣ Check if attempts already exhausted
    if (user.inCorrectAttempts >= 3)
    {
      return {
        success: false,
        error: "You have reached maximum login attempts. Contact administrator."
      };
    }

    console.log(email, password, user);

    const isMatch = await bcrypt.compare(password, user.password);

    // 3️⃣ Incorrect password
    if (!isMatch)
    {
      const updatedUser = await db.user.findOneAndUpdate(
        { email:String(email).toLocaleLowerCase() },
        { $inc: { inCorrectAttempts: 1 } },
        { returnDocument: "after" }
      );

      // 4️⃣ Auto block if limit reached
      if (updatedUser.inCorrectAttempts >= 3)
      {
        await db.user.updateOne(
          { email:String(email).toLocaleLowerCase() },
          { $set: { isBlocked: true, accountBlockedReason:"INVALID_CREDENTIALS_LIMIT_EXCEEDED" } }
        );

        return {
          success: false,
          error: "Maximum login attempts reached. Your account is blocked."
        };
      }

      return {
        success: false,
        error: "Invalid credentials",
        code:"INVALID_CREDENTIALS",
        data: {
          attemptsLeft: 3 - updatedUser.inCorrectAttempts
        }
      };
    }

    // 5️⃣ Successful login → reset attempts
    await db.user.updateOne(
      { email },
      {
        $set: { inCorrectAttempts: 0 }
      }
    );

    const token = generateToken(user);

    return {
      success: true,
      data: {
        user_details: user,
        token
      }
    };
  }
  catch (err)
  {
    console.log(err);
    return { success: false, error: err.message };
  }
}

async function updatePassword(data)
{
  try{
    const {email, new_password} = data;
    const hashed_password = await hashPassword(new_password);
    // console.log(new_password, hashed_password);

    const updateStatus = await db.user.updateOne({email}, {$set:{ password:hashed_password, passwordLastUpdatedOn:getKolkataTime() }});
    return { success:true, data:{ updateStatus } }
  }catch(err){
    console.log(err);
    return {success:false, error:err.message}
  }
}

async function requestOTPForLogin(email)
{
  try
  {
    email = email.toLocaleLowerCase();
    console.log(email);

    const user = await userDetails(email);

    if (!user) return {success: false, error: "User not found"};
    if(user.isBlocked) return {success:false, error:"Your account has been blocked"};

    const canSend = await canSendEmail(email);
    if (!canSend)
    {
      return {
        success: false,
        error: "OTP already sent. Please wait 5 minutes."
      };
    }

    if( ! await canSendMobileMessage()) return { success:false, error:"Servers are busy can't send Now", message:"Daily set Limit exceeded" }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(otp);

    // Hash OTP
    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    console.log( hashedOTP );
    // Send email
    const emailStatus = await sendEmail(
      email,
      "OTP for Login",
      otpLoginTemplate(email, otp, 5)
    );

    return {
      success: true,
      message: "OTP sent successfully",
      data:{hashedOTP :generateToken( {hashedOTP:hashedOTP}, expiresIn=5*60 ) }
    };
  }
  catch (err)
  {
    console.error(err);
    return { success: false, error: "Internal server error" };
  }
}

async function verifyOTP(email, otp, hashedOTPFromUser)
{
  email = email.toLocaleLowerCase();
  const user = await db.user.findOne({ email });

  if (!user)return { success: false, error: "Invalid request" };

  // here the jwt is decoded, if it is less than expiry time it is accepted, else rejected
  try{
    const decoded = jwt.verify(hashedOTPFromUser, process.env.JWT_SECRET);
    console.log(decoded, otp);

    const userHashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    console.log(userHashedOtp)

    if ( decoded.hashedOTP !== userHashedOtp )
    {
      return { success: false, error: "Invalid OTP" };
    }

    const user_details = await userDetails( email );
    const token = generateToken( user_details );

    return { success: true, data: { user_details:user_details, token:token }};

  }catch(err){
    console.log(err);
    return {success:false, error:"OTP Expired"}
  }
}

async function blockUserFromSupport(email, secret_key)
{
  try{
    const user = await db.user.findOne({ email });
    if (!user) {
      return { success: false, error: "No user Found" };
    }

    if(secret_key == user.blockableSecretKey)
    {
      const updateStatus = await blockUser(email);
      return { success:true, data:{ updateStatus } }
    }else{
      return { success:false, error:"Nice attempt, But Failed..." }
    }
  }catch(err){return {success:false, error:err.message}}
}

async function updatePhoneNumberOtpRequest(user_id, PhoneNumber){
  try{
    const OTP = generateOTP(6);
    const user = await db.user.findOne({_id: new ObjectId(user_id)});
    if(!user) return {success:false, error:"User not found on Database"}
    console.log(user)

    if( ! await canSendMobileMessage() ) return { success:false, error:"Servers are busy can't send Now", message:"Daily set Limit exceeded" }
    
    const messagePayload = `Hi ${user.name}. ${OTP} is the OTP for mobile verification on ${FRANCHISE_NAME}`;

    const response = await sendPhoneMessage(PhoneNumber, messagePayload);
    return {success:true, data:{ otp:OTP, response }}
  }catch(err){
    console.log(err)
    return {success:false, error:err.message}
  }
}

async function updatePhoneNumber(user_id, phoneNumber)
{
    try
    {
        if (!ObjectId.isValid(user_id)) return { success: false, error: "Invalid user id" };
        if (!phoneNumber) return { success: false, error: "Invalid phone number" };

        const updateStatus = await db.user.updateOne(
            { _id: new ObjectId(user_id) },
            { $set: { phoneNumber } }
        );

        if (updateStatus.matchedCount === 0) return { success: false, error: "User not found" };

        return {
            success: true,
            data: {
                modified: updateStatus.modifiedCount === 1
            }
        };
    }
    catch (err)
    {
        return { success: false, error: err.message };
    }
}

async function refreshToken(decoded)
{
  try {
    const {
      _id,
      email,
      name,
      profile_pic,
      role,
      ac_created_on
    } = decoded;

    const token = generateToken({
      _id,
      email,
      name,
      profile_pic,
      role,
      ac_created_on
    });

    const userDetails = await db.user.findOne({_id: new ObjectId(_id)});

    return { success: true, data: { token, userDetails } };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

// CART
async function updateCart({ user_id, new_cart = [] })
{
  try
  {
    if (!user_id) return { success: false, error: "user details needed" };

    const userObjectId = new ObjectId(user_id);

    const updateStatus = await db.cart.updateOne(
      { user_id: userObjectId },
      {
        $set: { cartItems:new_cart, updatedAt: new Date() }
      },
      { upsert: true }
    );

    return {
      success: true,
      data: {
        matchedCount: updateStatus.matchedCount,
        modifiedCount: updateStatus.modifiedCount,
        upsertedId: updateStatus.upsertedId || null
      }
    };
  }
  catch (err)
  {
    return { success: false, error: err.message };
  }
}

async function getCart(user_id = null)
{
  try
  {
    if (!user_id) return { success: false, error: "user details needed" };

    const cart = await db.cart.findOne({
      user_id: new ObjectId(user_id)
    });

    if (!cart) return { success: false, error: "cart not found" };
    return { success: true, data: cart };
  }
  catch (err){
    return { success: false, error: err.message };
  }
}

// admin related routes
async function blockUnBlockUser(user_id) {
  try {
    const user = await db.users.findOne(
      { _id: new ObjectId(user_id) },
      { projection: { isBlocked: 1 } }
    );

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const newStatus = !user.isBlocked;

    await db.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { isBlocked: newStatus } }
    );

    return {
      success: true,
      data: { isBlocked: newStatus }
    };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function deleteUser(user_id) {
  try {
    const user = await db.user.findOne(
      { _id: new ObjectId(user_id) },
      { projection: { role: 1 } }
    );

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.role === "ADMIN") {
      const anotherAdminExists = await isAnotherAdminAvailable(user_id);

      if (!anotherAdminExists) {
        return {
          success: false,
          error: "At least one ADMIN must exist on the platform"
        };
      }
    }

    const deleteStatus = await db.user.deleteOne({
      _id: new ObjectId(user_id)
    });
    

    return { success: true, data: deleteStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

// address
async function addAddress(userId=null, address){
  try{
    // address = { address:"TEXT", pincode:507170, metaData:{} }
    const payload = { ...address, savedOn: new Date(), userId: new ObjectId(userId) };
    const status = await db.address.insertOne(payload);

    return {success:true, data:{status}}
  }catch(err){
    return {success:false, error:err.message}
  }
}

async function listAddress(userId=null){
  try{
    const addressList = await db.address.find({ userId:new ObjectId(userId) }).toArray();
    return {success:true, data:{addressList}}
  }catch(err){
    return {success:false, error:err.message}
  }
}

async function deleteAddress(addressId){
  try{
    const status = await db.address.deleteOne({ _id:new ObjectId(addressId) });
    return {success:true, data:{status}}
  }catch(err){
    return {success:false, error:err.message}
  }
}


module.exports = {
    enrollUser, handleLogin, enrollUserByGoogle, refreshToken, updatePassword,requestOTPForLogin, verifyOTP, updatePhoneNumberOtpRequest, updatePhoneNumber,
    getCart,updateCart,
    blockUnBlockUser, deleteUser, blockUserFromSupport,
    addAddress, listAddress, deleteAddress
}

// helper functions
async function userDetails(email) {
  try {
    const user = await db.user.findOne(
      { email },
      { projection: { password: 0 } } // hide password
    );

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return user;

  } catch (err) {
    return { };
  }
}
async function isAnotherAdminAvailable(excludeUserId) {
  try {
    const adminCount = await db.users.countDocuments({
      role: "ADMIN",
      _id: { $ne: new ObjectId(excludeUserId) }
    });

    return adminCount > 0;

  } catch (err) {
    console.error(err);
    return false;
  }
}
async function checkEmailExistence(email) {
  try {
    const count = await db.user.countDocuments({ email });
    return count > 0;
  } catch (err) {
    console.error(err);
    return true; // safe default
  }
}


function generateToken( data, expiresIn=60*60 )
{
  const { JWT_SECRET } = process.env;
  const token = jwt.sign( data, JWT_SECRET, { expiresIn:expiresIn }  )
  return token;
}