const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


const sendEmail = async (to, subject, message) => {

  try {

    await transporter.sendMail({
      from: `ULMiND <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,

      html: `
        <div style="
          font-family:Arial;
          background:#f4f6f8;
          padding:25px;
        ">
          <div style="
            max-width:600px;
            margin:auto;
            background:white;
            padding:25px;
            border-radius:10px;
            box-shadow:0 4px 10px rgba(0,0,0,0.1);
          ">
            <h2 style="color:#4CAF50;">🎉 Welcome to ULMiND</h2>
            <p style="white-space:pre-line;font-size:14px;">
              ${message}
            </p>

            <hr/>

            <p style="font-size:12px;color:gray;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      `
    });

    console.log("✅ Email sent to:", to);

  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

module.exports = sendEmail;
