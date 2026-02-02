const nodemailer = require('nodemailer');

/* =================================
   TRANSPORTER
================================= */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'ghoshtirtha1234@gmail.com',
    pass: 'msxq kgeu rjpz etmu',
  },
});


/* =================================
   SEND EMAIL FUNCTION
================================= */
const sendEmail = async (to, subject, message) => {

  try {

    await transporter.sendMail({
      from: `IssueForge <${process.env.EMAIL_USER}>`,
      to,
      subject,

      // plain text
      text: message,

      // HTML version (professional look)
      html: `
        <div style="font-family:Arial;padding:15px">
          <h2>🚀 Issue Assigned</h2>
          <pre style="font-size:14px">${message}</pre>
        </div>
      `
    });

    console.log("✅ Email sent to:", to);

  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

module.exports = sendEmail;
