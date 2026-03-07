const nodemailer = require('nodemailer');
const { Resend } = require('resend');

// ─── Provider selection ───
// Use Resend (HTTP API) on deployment, Nodemailer SMTP on localhost
const useResend = !!process.env.RESEND_API_KEY;

// ─── Resend client (HTTP-based, works on Render free tier) ───
let resend = null;
if (useResend) {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('📧 Email provider: Resend (HTTP API)');
} else {
    console.log('📧 Email provider: Nodemailer SMTP (localhost)');
}

// ─── Nodemailer transporter (SMTP, localhost only) ───
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
};

let transporter = null;
if (!useResend) {
    transporter = createTransporter();
    transporter.verify()
        .then(() => console.log('✅ SMTP connection verified successfully'))
        .catch((err) => console.error('❌ SMTP connection failed:', err.message));
}

// ─── Build HTML email content ───
const buildEmailHTML = (otp, purpose) => {
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

    return `
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
};

// ─── Send OTP email ───
const sendOTPEmail = async (email, otp, purpose = 'login') => {
    const subject = purpose === 'register'
        ? 'Verify Your Email — Student Project Marketplace'
        : purpose === 'reset-password'
            ? 'Reset Your Password — Student Project Marketplace'
            : 'Login Verification — Student Project Marketplace';

    const htmlContent = buildEmailHTML(otp, purpose);

    if (useResend) {
        // ── Resend (HTTP API) ──
        try {
            const fromAddress = process.env.RESEND_FROM || 'Student Project Marketplace <onboarding@resend.dev>';
            const { data, error } = await resend.emails.send({
                from: fromAddress,
                to: [email],
                subject,
                html: htmlContent,
            });

            if (error) {
                console.error(`❌ Resend error for ${email}:`, error);
                throw new Error(error.message);
            }

            console.log(`✅ OTP email sent via Resend to ${email} for ${purpose} (id: ${data?.id})`);
        } catch (error) {
            console.error(`❌ Failed to send OTP email to ${email}:`, error.message);
            throw new Error('Failed to send verification email. Please try again later.');
        }
    } else {
        // ── Nodemailer SMTP (localhost) ──
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error('❌ SMTP_USER or SMTP_PASS not configured');
            throw new Error('Email service is not configured. Please contact support.');
        }

        try {
            await transporter.sendMail({
                from: `"Student Project Marketplace" <${process.env.SMTP_USER}>`,
                to: email,
                subject,
                html: htmlContent,
            });
            console.log(`✅ OTP email sent via SMTP to ${email} for ${purpose}`);
        } catch (error) {
            console.error(`❌ Failed to send OTP email to ${email}:`, error.message);
            throw new Error('Failed to send verification email. Please try again later.');
        }
    }
};

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { sendOTPEmail, generateOTP };
