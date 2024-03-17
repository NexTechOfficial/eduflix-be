//@ts-check
const { Location, UserRoles } = require('../../config');
const { httpStatus, PurifyError, DateFuns } = require('../utils');
const { UserModel } = require('../models');
const { z } = require('zod');
/**
 * @param {import('../../global').req} req
 * @param {import('../../global').res} res
 */
exports.createUser = async function (req, res) {
  try {
    //creating validator to verify input
    const Validator = z.object({
      first_name: z
        .string({
          required_error: 'First Name is Required',
          invalid_type_error: 'Name Must be a string',
        })
        .refine(str => str.trim().length > 0, {
          message: 'Empty Names are not allowed',
        }),
      last_name: z
        .string({
          required_error: 'Last Name is Required',
          invalid_type_error: 'Name Must be a string',
        })
        .refine(str => str.trim().length > 0, {
          message: 'Empty Names are not allowed',
        }),
      avatar: z
        .string({ invalid_type_error: 'avatar must be of type string' })
        .optional(),
      address: z
        .string({
          required_error: 'Address Name is Required',
          invalid_type_error: 'Address Must be a string',
        })
        .refine(str => str.trim().length > 0, {
          message: 'Empty Addresses are not allowed',
        }),
      email: z
        .string({ required_error: 'E-Mail is Required' })
        .email({ message: 'Must Be A valid Email' }),
      phone: z.coerce
        .number({
          invalid_type_error: 'Must Be A Valid Phone Number',
          required_error: 'Phone Number is Required',
        })
        .gte(6000000000, 'Phone number is too small')
        .lte(919999999999, 'Phone number is too big')
        .transform(arg => {
          const StringNumber = String(arg);
          if (StringNumber.length == 12) {
            return Number(StringNumber.slice(2, 12));
          }
          return arg;
        }),
      date_of_birth: z
        .string()
        .refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val), {
          message: 'Invalid date format (YYYY-MM-DD)',
          path: ['date_of_birth'],
        })
        .transform(val => DateFuns.parseDate(val)),
      type: z
        .string({
          invalid_type_error: 'Type Must Be String',
          required_error: 'Type is Required',
        })
        .refine(
          value => !(value != UserRoles.STUDENT && value != UserRoles.TEACHER),
          {
            message: 'Invalid Role Provided!',
          }
        ),
    });
    //testing input and return in case of invalid input
    const Result = await Validator.safeParseAsync(req.body);
    if (!Result.success) {
      const Error = PurifyError(Result);
      return res.status(httpStatus.precondition_failed).send({
        status: httpStatus.precondition_failed,
        success: false,
        message: Error[0].message,
        data: Error,
      });
    }
    //sending data to DB and return response
    const { data } = Result;
    const Resp = await UserModel.createUser(data);
    return res.status(Resp.status).send(Resp);
  } catch (err) {
    res.status(httpStatus.precondition_failed).send({
      status: httpStatus.precondition_failed,
      location: Location.controller,
      success: false,
      message: 'Error Creating Account',
      exception: String(err),
      error: err,
    });
  }
};
/**
 * @param {import('../../global').req} req
 * @param {import('../../global').res} res
 */
exports.verifyOTP = async function (req, res) {
  try {
    const Validator = z.object({
      user_id: z
        .string({
          required_error: 'User ID is Required',
          invalid_type_error: 'User ID be a string',
        })
        .refine(str => str.trim().length > 0, {
          message: 'Empty User ID are not allowed',
        }),
      otp: z.coerce
        .number({
          invalid_type_error: 'Must Be A Valid OTP',
          required_error: 'OTP is Required',
        })
        .gte(1000, "OTP can't be less then 1000")
        .lte(9999, "OTP can't be grater then 9999"),
    });
    //testing input and return in case of invalid input
    const Result = await Validator.safeParseAsync(req.body);
    if (!Result.success) {
      const Error = PurifyError(Result);
      return res.status(httpStatus.precondition_failed).send({
        status: httpStatus.precondition_failed,
        success: false,
        message: Error[0].message,
        data: Error,
      });
    }
    const { data } = Result;
    const result = await UserModel.verifyOTP(data.user_id, data.otp);
    if (result.status == httpStatus.success) req.user = result.data.user;
    return res.status(result.status).send(result);
  } catch (err) {
    res.status(httpStatus.precondition_failed).send({
      status: httpStatus.precondition_failed,
      location: Location.controller,
      success: false,
      message: 'Error Verifing Account',
      exception: String(err),
      error: err,
    });
  }
};
