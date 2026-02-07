const { FRANCHISE_NAME, FRONTEND_URL } = process.env;

function acccountCreationTemplate(name, email)
{
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <title>Account Created</title>
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
            }
            h1 {
                color: #2c3e50;
            }
            p {
                color: #555;
                line-height: 1.6;
            }
            .highlight {
                color: #2d89ef;
                font-weight: bold;
            }
            .btn {
                display: inline-block;
                margin-top: 16px;
                padding: 12px 20px;
                background-color: #2d89ef;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
            }
            .btn-danger {
                background-color: #e74c3c;
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
            <h1>Welcome, ${name} 👋</h1>

            <p>
                Your account has been successfully created using the email
                <span class="highlight">${email}</span>.
            </p>

            <p>
                You can now login using the button below.
            </p>

            <a 
                href="${FRONTEND_URL}/login"
                class="btn"
                target="_blank"
            >
                Login to ${FRANCHISE_NAME}
            </a>

            <p style="margin-top: 24px;">
                If you did not create this account, you can deactivate it immediately.
            </p>

            <a
                href="${FRONTEND_URL}/support/deactivate-account/${encodeURIComponent(email)}"
                class="btn btn-danger"
                target="_blank"
            >
                Deactivate My Account
            </a>

            <div class="footer">
                <p>© ${new Date().getFullYear()} ${FRANCHISE_NAME}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

module.exports = { acccountCreationTemplate };