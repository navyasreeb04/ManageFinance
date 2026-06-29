require('dotenv').config();
const nodemailer = require('nodemailer');

//  Using App Password (Recommended for personal projects)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"FinTech" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Registration Email
async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to FinTech!";
  const text = `Hi ${name},\n\nThank you for registering with FinTech. We're excited to have you on board!\n\nIf you have any questions, feel free to reach out to our support team.\n\nBest regards,\nThe FinTech Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #2563eb;">Welcome to FinTech!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering with FinTech. We're excited to have you on board!</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">Best regards,<br>The FinTech Team</p>
    </div>
  `;
  await sendEmail(userEmail, subject, text, html);
}

// Transaction Success Email
async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = 'Transaction Successful!';
  const text = `Hello ${name},\n\nYour transaction of ₹${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe FinTech Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #16a34a;"> Transaction Successful!</h2>
      <p>Hello ${name},</p>
      <p>Your transaction of <strong>₹${amount}</strong> to account <strong>${toAccount}</strong> was successful.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">Best regards,<br>The FinTech Team</p>
    </div>
  `;
  await sendEmail(userEmail, subject, text, html);
}

// PIN Reset OTP Email
async function sendPinResetOTP(userEmail, name, otp) {
  const subject = "Reset Your Transaction PIN";
  const text = `Hi ${name},\n\nYou requested to reset your transaction PIN. Your OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe FinTech Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #2563eb;"> Reset Your PIN</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your transaction PIN.</p>
      <div style="text-align: center; padding: 20px; background: #eff6ff; border-radius: 8px; margin: 16px 0;">
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</p>
      </div>
      <p style="color: #64748b; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>.</p>
      <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">Best regards,<br>The FinTech Team</p>
    </div>
  `;
  await sendEmail(userEmail, subject, text, html);
}

// Transaction Failure Email (Optional)
async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = ' Transaction Failed';
  const text = `Hello ${name},\n\nWe regret to inform you that your transaction of ₹${amount} to account ${toAccount} has failed. Please try again later.\n\nBest regards,\nThe FinTech Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #dc2626;">Transaction Failed</h2>
      <p>Hello ${name},</p>
      <p>We regret to inform you that your transaction of <strong>₹${amount}</strong> to account <strong>${toAccount}</strong> has failed.</p>
      <p>Please try again later.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">Best regards,<br>The FinTech Team</p>
    </div>
  `;
  await sendEmail(userEmail, subject, text, html);
}

// Add this function
async function sendPasswordResetOTP(userEmail, name, otp) {
    const subject = "Reset Your Password";
    const text = `Hi ${name},\n\nYou requested to reset your password. Your OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe FinTech Team`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #2563eb;">Reset Your Password</h2>
            <p>Hi ${name},</p>
            <p>You requested to reset your password.</p>
            <div style="text-align: center; padding: 20px; background: #eff6ff; border-radius: 8px; margin: 16px 0;">
                <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</p>
            </div>
            <p style="color: #64748b; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>.</p>
            <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">Best regards,<br>The FinTech Team</p>
        </div>
    `;
    await sendEmail(userEmail, subject, text, html);
}


module.exports = {
  sendEmail,
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
  sendPinResetOTP,
  sendPasswordResetOTP, 
};