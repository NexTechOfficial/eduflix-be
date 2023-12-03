import express from 'express'
import httpStatus from '../utils/httpStatus'
import { UserSchema,getAllUsersSchema } from '../types'
import { PurifyError } from '../utils'
import { UserModel } from '../models'
import bcrypt from'bcrypt';
import jwt from 'jsonwebtoken';
const Password_Salt = 10;
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function createUser(req, res) {
  try {
    const Result = await UserSchema.safeParseAsync(req.body)
    if (!Result.success) {
      const Error = PurifyError(Result)
      return res.status(httpStatus.precondition_failed).send({
        status: httpStatus.precondition_failed,
        error: true,
        message: Error[0].message,
        data: Error,
      })
    }
    const {data} = Result;
    data.password = await bcrypt.hash(data.password,Password_Salt);
    const Resp = await UserModel.createUser(data);
    return res.status(Resp.status).send(Resp);
  } catch (err) {
    return res.status(httpStatus.internal_server_error).send({
      status: httpStatus.internal_server_error,
      error: true,
      message: 'Error Creating Account',
      location: 'controller',
      exception: String(err),
      data: err,
    })
  }
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function getAllUsers(req,res){
  try {
    const Result = await getAllUsersSchema.safeParseAsync(req.query);
    if(!Result.success){
      const Error = PurifyError(Result)
      return res.status(httpStatus.precondition_failed).send({
        status: httpStatus.precondition_failed,
        error: true,
        message: Error[0].message,
        data: Error,
      })
    }
    const {data} = Result;
    const Resp = await UserModel.getAllUsers(data);
    return res.status(Resp.status).send(Resp);
  } catch (err) {
    return res.status(httpStatus.internal_server_error).send({
      status: httpStatus.internal_server_error,
      error: true,
      message: 'Error Fetching Users',
      location: 'controller',
      exception: String(err),
      data: err,
    })
  }
}