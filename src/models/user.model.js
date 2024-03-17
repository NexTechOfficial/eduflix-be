//@ts-check
const { UserDoc } = require('../database/user.schema');
const { generateDocId } = require('../database/counter.schema');
const { httpStatus, NumFuns, Session } = require('../utils');
const { Location } = require('../../config');
const { sendEmail } = require('../utils/sendMail');
const jwt = require('jsonwebtoken');
const { ENCRYPTION_KEY } = process.env;
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
  const session = await Session.start(UserDoc);
  try {
    //generating a random OTP to verify
    input.otp = NumFuns.generateOTP(4);
    //generating human readable index id
    input.id = await generateDocId(UserDoc.modelName, session);
    //creating a new user
    const newUser = await new UserDoc(input).save({ session });
    //sending mail to verify
    const MailResult = await sendEmail(
      `<h1>Your OTP is -> ${input.otp}</h1>`,
      'Eduflix',
      input.email
    );

    if (!MailResult.success) {
      await Session.rollback(session);
      return {
        status: httpStatus.internal_server_error,
        success: true,
        message: 'Unable to verify!',
        data: null,
      };
    }
    await Session.commit(session);
    const { password, ...UserData } = newUser;
    return {
      status: httpStatus.created,
      success: true,
      message: 'Account Created!',
      data: UserData,
    };
  } catch (err) {
    await Session.rollback(session);
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

/**
 *
 * @param {string} user_obj_id
 * @param {number} OTP
 */
exports.verifyOTP = async function (user_obj_id, OTP) {
  const Transaction = await Session.start(UserDoc);
  try {
    const User = await UserDoc.findById(user_obj_id, null, {
      session: Transaction,
    });
    if (User == null) {
      return {
        status: httpStatus.not_found,
        success: false,
        message: 'Account Not Found',
        data: null,
      };
    }
    if (User.otp != OTP) {
      return {
        status: httpStatus.not_acceptable,
        success: false,
        message: 'Invalid OTP',
        data: null,
      };
    }
    await UserDoc.updateOne(
      { _id: user_obj_id },
      { $set: { otp: null , last_online: new Date()} },
      { session: Transaction }
    );
    const AccessToken = jwt.sign(
      {
        obj_id: User._id.toString(),
        int_id: Number(User.id),
        first_name: User.first_name,
        last_name: User.last_name,
        email: User.email,
        phone: User.phone,
        last_login: new Date().toISOString(),
      },
      ENCRYPTION_KEY,
      { expiresIn: '30d' }
    );
    const { password, ...UserData } = User;
    return {
      status: httpStatus.success,
      success: true,
      message: 'Verified!',
      data: {
        user:{
          user_obj_id : UserData._id.toString(),
          user_int_id : Number(UserData.id),
          id: Number(UserData.id),
          first_name: UserData.first_name,
          last_name: UserData.last_name,
          date_of_birth: UserData.date_of_birth,
          avatar: UserData.avatar,
          phone: UserData.phone,
          email: UserData.email,
          address: UserData.address,
          type: UserData.type,
          is_new_user: UserData.is_new_user,
          last_online: UserData.last_online,
          otp:UserData.otp,
          is_email_verified:UserData.is_email_verified,
          is_phone_verified:UserData.is_phone_verified,
          tick_mark:UserData.tick_mark,
          status: UserData.status,
        },
        access_token: AccessToken,
      },
    };
  } catch (err) {
    await Session.rollback(Transaction);
    return {
      status: httpStatus.internal_server_error,
      success: false,
      message: 'Unable to verify!',
      location: Location.model,
      exception: String(err),
      error: err,
    };
  }
};
