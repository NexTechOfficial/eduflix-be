import DB from '../../database/sqlDB.connect'
import { BIGINT, STRING, INTEGER, DATEONLY, BOOLEAN, TEXT } from 'sequelize'
import { UserRole } from '../utils'

/**
 * @typedef {Object} UserTableType
 * @property {number} id
 * @property {string} name
 * @property {string} avatar
 * @property {string} phone
 * @property {string} email
 * @property {null | string} city
 * @property {null | Date} date_of_birth
 * @property {string} password
 * @property {null | string} password_hash
 * @property {null | string} refered_by
 * @property {boolean} new_user
 * @property {boolean} conditions_accepted
 * @property {boolean} two_step_verify
 * @property {null | string} device_token
 * @property {null | 'ios' | 'android' | 'windows' | 'linux'} device_token
 * @property {number} status
 */
/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<UserTableType, UserTableType>>}
 */
export const UserTable = DB.define(
  'user',
  {
    id: {
      type: BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING,
      allowNull: false,
      validate: {
        is: {
          args: ['^[ A-Za-z. ]+$', 'i'],
          msg: 'Only Alphabets and Dot is allowed in Name',
        },
      },
      set(value) {
        this.setDataValue('name', value.trim())
      },
    },
    avatar: {
      type: STRING,
      allowNull: true,
      defaultValue: null,
    },
    phone: {
      type: BIGINT,
      validate: {
        isNumeric: {
          args: true,
          msg: 'Only numeric values allowed as Phone number',
        },
        len: {
          args: [/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[78965]\d{9}$/],
          msg: 'Phone number must contains only 10 to 12 Digits',
        },
      },
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: {
        name: 'users_email_key',
        msg: 'E-Mail Already Exist',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Must be a valid E-Mail',
        },
      },
      set(value) {
        this.setDataValue(
          'email',
          value != null ? value.trim().toLowerCase() : null
        )
      },
    },
    city: {
      type: STRING,
      allowNull: true,
    },
    date_of_birth: {
      type: DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    password: {
      type: STRING,
      allowNull: false,
    },
    password_hash: {
      type: STRING,
      allowNull: true,
    },
    role: {
      type: STRING,
      defaultValue: UserRole.student,
      validate: {
        isIn: {
          args: [[UserRole.admin, UserRole.student, UserRole.teacher]],
          msg: 'Invalid User Role',
        },
      },
    },
    refered_by: {
      type: BIGINT,
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumeric: {
          args: true,
          msg: 'Only Digits are allowed as Refered By',
        },
      },
    },
    new_user: {
      type: BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    conditions_accepted: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    two_step_verify: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    device_token: {
      type: TEXT,
      defaultValue: null,
      allowNull: true,
    },
    device_os: {
      type: TEXT,
      defaultValue: null,
      allowNull: true,
      validate: {
        isIn: {
          args: [['android', 'ios', null]],
          msg: 'Invalid OS Value',
        },
      },
    },
    status: {
      type: INTEGER,
      defaultValue: 1,
      validate: {
        isIn: {
          args: [[-1, 0, 1]],
          msg: 'Invalid Status Value',
        },
      },
    },
  },
  {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    tableName: 'user',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

UserTable.sync({
  force: false,
  alter: false,
})
