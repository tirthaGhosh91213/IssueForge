const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com',
    pass: 'YOUR_APP_PASSWORD'
  }
});

module.exports = async (to, subject, text) => {
  await transporter.sendMail({
    from: 'IssueForge <YOUR_EMAIL@gmail.com>',
    to,
    subject,
    text
  });
};
