const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "173b1d9a364c05",
      pass: "f77eca4bb916a9",
    },
  });

  const mailOpitons = {
    from: "TinopiaEnterprises <yaseennazir1221@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOpitons);
};

module.exports = sendMail;
