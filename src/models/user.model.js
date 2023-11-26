import { UserTable } from '../db'
import { UserSchema } from '../types'
import httpStatus from '../utils/httpStatus'
import { z } from 'zod'
/**
 * @param {z.infer<typeof UserSchema>} Data
 */
export async function createUser(Data) {
  try {
    const newUser = await UserTable.create(Data)
    delete newUser.dataValues.password
    delete newUser.dataValues.password_hash
    return {
      status: httpStatus.created,
      error: false,
      message: 'Account Created',
      data: newUser,
    }
  } catch (err) {
    return {
      status: httpStatus.created,
      error: true,
      message: err.errors[0].message
        ? err.errors[0].message
        : 'Error Creating Account',
      location: 'model',
      exception: String(err),
      data: err,
    }
  }
}
