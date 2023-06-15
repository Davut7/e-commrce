const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendActivationMail = async (to, link) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Activation Link",
    text: "",
    html: `
    <div>
    <h1>Activation Link</h1>
    <a href="${link}">${link}</a>
    </div>
  `,
  });
};

const resetPasswordMail = async (to, link) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Reset Password",
    text: "",
    html: `
    <div>
    <h1>G to link to reset your password</h1>
    <a href="${link}">${link}</a>
    <p>You have 5 minutes</p>
    </div>`,
  });
};
const attentionMail = async to => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Someone wants to login your account",
    text: "The rate limit of $",
    html: `
    <div>
    <h1>Go to your account and change password</h1>
    </div>`,
  });
};

module.exports = { sendActivationMail, resetPasswordMail, attentionMail };
