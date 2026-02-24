const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendOTPEmail = async (email, otp, purpose = 'login') => {
    const subject = purpose === 'register'
        ? 'Verify Your Email — Student Project Marketplace'
        : purpose === 'reset-password'
            ? 'Reset Your Password — Student Project Marketplace'
            : 'Login Verification — Student Project Marketplace';

    const heading = purpose === 'register'
        ? 'Complete Your Registration'
        : purpose === 'reset-password'
            ? 'Reset Your Password'
            : 'Login Verification';

    const description = purpose === 'register'
        ? 'Use the code below to verify your email and complete your registration.'
        : purpose === 'reset-password'
            ? 'Use the code below to verify your identity and reset your password.'
            : 'Use the code below to verify your login.';

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 480px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${heading}</h1>
        </div>
        <div style="padding: 32px; text-align: center;">
            <p style="color: #a0aec0; font-size: 14px; margin-bottom: 24px;">
                ${description}
            </p>
            <div style="background: #16213e; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #667eea;">
                    ${otp}
                </span>
            </div>
            <p style="color: #718096; font-size: 12px; margin-bottom: 8px;">
                This code expires in <strong style="color: #e2e8f0;">5 minutes</strong>.
            </p>
            <p style="color: #718096; font-size: 12px;">
                If you didn't request this, you can safely ignore this email.
            </p>
        </div>
        <div style="background: #16213e; padding: 16px; text-align: center;">
            <p style="color: #4a5568; font-size: 11px; margin: 0;">
                Student Project Marketplace &copy; ${new Date().getFullYear()}
            </p>
        </div>
    </div>
    `;

    await transporter.sendMail({
        from: `"Student Project Marketplace" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html: htmlContent,
    });
};

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { sendOTPEmail, generateOTP };
