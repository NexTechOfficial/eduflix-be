//@ts-check
const { UserDoc } = require('../database/user.schema');
const { generateDocId } = require('../database/counter.schema');
const { httpStatus, NumFuns, Session } = require('../utils');
const { Location } = require('../../config');
const { sendEmail } = require('../utils/sendMail');
/**
 * @typedef {Object} createUser
 * @property {number} [id]
 * @property {string} first_name
 * @property {string} last_name
 * @property {Date} date_of_birth
 * @property {string | undefined} [avatar]
 * @property {number} phone
 * @property {string} email
 * @property {string} type
 * @property {string | undefined} address
 * @property {number} [otp] - [] is for optional property.
 */
/**
 * @param {createUser} input
 */
exports.createUser = async function (input) {
  try {
    //generating a random OTP to verify
    input.otp = NumFuns.generateOTP(4);
    //generating human readable index id
    input.id = await generateDocId(UserDoc.modelName);
    //creating a new user
    const newUser = await new UserDoc(input).save();
    //sending mail to verify
    const MailResult = await sendEmail(
      `<h1>Your OTP is -> ${input.otp}</h1>`,
      'Eduflix',
      input.email
    );

    if (!MailResult.success) {
      return {
        status: httpStatus.internal_server_error,
        success: true,
        message: 'Unable to verify!',
        data: null,
      };
    }
    return {
      status: httpStatus.created,
      success: true,
      message: 'Account Created!',
      data: newUser,
    };
  } catch (err) {
    if (err.code == 11000)
      return {
        status: httpStatus.conflict,
        success: false,
        message: 'E-mail already in use!',
        data: err,
      };
    return {
      status: httpStatus.internal_server_error,
      success: false,
      location: Location.model,
      message: 'Error Creating Account',
      exception: String(err),
      error: err,
    };
  }
};
