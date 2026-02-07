const { FRANCHISE_NAME } = process.env;

function otpLoginTemplate(email, otp, validityMinutes = 5)
{
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <title>Your Login OTP</title>
        <style>
            body {
                font-family: Arial, Helvetica, sans-serif;
                background-color: #f5f7fa;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                text-align: center;
            }
            h1 {
                color: #2c3e50;
            }
            p {
                color: #555;
                line-height: 1.6;
                margin: 12px 0;
            }
            .otp-box {
                margin: 24px 0;
                padding: 16px;
                font-size: 32px;
                letter-spacing: 8px;
                font-weight: bold;
                color: #2d89ef;
                background-color: #f0f6ff;
                border-radius: 8px;
                display: inline-block;
            }
            .warning {
                color: #e74c3c;
                font-size: 14px;
                margin-top: 16px;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>OTP Login</h1>

            <p>Hello${email ? ` ${email}` : ""},</p>

            <p>
                Use the following One-Time Password (OTP) to log in to
                <strong>${FRANCHISE_NAME}</strong>.
            </p>

            <div class="otp-box">${otp}</div>

            <p>
                This OTP is valid for <strong>${validityMinutes} minutes</strong>.
            </p>

            <p class="warning">
                Do not share this OTP with anyone. Our team will never ask for it.
            </p>

            <div class="footer">
                <p>© ${new Date().getFullYear()} ${FRANCHISE_NAME}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

module.exports = { otpLoginTemplate };
