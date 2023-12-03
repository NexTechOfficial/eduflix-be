'use strict'
import { UserTable } from '../db'
import { UserSchema, getAllUsersSchema } from '../types'
import httpStatus from '../utils/httpStatus'
import { Status } from '../utils'
import { Op } from 'sequelize'
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
/**
 *
 * @param {z.infer<typeof getAllUsersSchema>} Input
 * @param {number} limit
 * @type {{$id$:{[x:symbol]:number}}} Where
 */
export async function getAllUsers(Input) {
  try {
    const allUsers = await UserTable.findAndCountAll({
      where: {
        id: {
          [Op.gt]: Input.last_index,
        },
        status: Status.ACTIVE,
      },
      attributes: {
        exclude: ['password', 'password_hash'],
      },
      limit: Input.limit,
      raw: true,
    })
    return {
      status: httpStatus.success,
      error: false,
      message: 'Users Fetched',
      data: {
        last_index: Input.last_index,
        total_count: allUsers.count,
        current_count: allUsers.rows.length,
        rows: allUsers.rows,
      },
    }
  } catch (err) {
    return {
      status: httpStatus.internal_server_error,
      error: true,
      location: 'model',
      message: 'Unable to fetch users',
      exception: String(err),
      data: err,
    }
  }
}
