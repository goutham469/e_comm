const bcrypt = require("bcrypt");

function getKolkataTime() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
}

function generatePassword(length = 12)
{
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!%*?&";

    let password = "";

    for (let i = 0; i < length; i++)
    {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
}

function generateOTP(length = 6)
{
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++)
  {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

module.exports = { 
  getKolkataTime, hashPassword, generatePassword, generateOTP
 }