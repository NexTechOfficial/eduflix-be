//@ts-check
const nodemailer = require('nodemailer');
const { SMTP_MAIL, SMTP_PASS } = process.env;
const transporter = nodemailer.createTransport({
  // host: SMTP_HOST,
  // port: SMTP_PORT,
  // secure: false,
  // auth: {
  //   user: SMTP_USERNAME,
  //   pass: SMTP_PASSWORD,
  // },
  service: 'gmail',
  auth: {
    user: SMTP_MAIL,
    pass: SMTP_PASS,
  },
});
/**
 * @param {string} html
 * @param {string} subject
 * @param {string} email
 * @returns {Promise<{error:any,message:string,success:boolean,exception:string} | {success:true,resp:import('nodemailer').SentMessageInfo}>}
 */
exports.sendEmail = async function (html, subject, email) {
  try {
   const Resp = await transporter.sendMail({ html, subject, from: SMTP_MAIL, to: email });
    return {
      success: true,
      resp:Resp
    };
  } catch (err) {
    return {
      success: false,
      message: 'Email Not Sent',
      exception: String(err),
      error: err,
    };
  }
};
