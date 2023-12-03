import { z } from 'zod'
import { UserRole } from '../utils'
const ValidRoles = [UserRole.admin, UserRole.student, UserRole.teacher]
export const UserSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({
      required_error: 'Name is Required',
      invalid_type_error: 'Name Must be a string',
    })
    .refine(str => str.trim().length > 0, {
      message: 'Empty Names are not allowed',
    }),
  email: z
    .string({ required_error: 'E-Mail is Required' })
    .email({ message: 'Must Be A valid Email' }),
  password: z
    .string({ required_error: 'Password is Required' })
    .refine(str => str.trim().length > 0, {
      message: 'Empty Passwords are not allowed',
    }),
  phone: z.coerce
    .number({
      invalid_type_error: 'Must Be A Valid Phone Number',
      required_error: 'Phone Number is Required',
    })
    .gte(6000000000, 'Phone number is too small')
    .lte(919999999999, 'Phone number is too big')
    .transform(arg => {
      const StringNumber = String(arg)
      if (StringNumber.length == 12) {
        return Number(StringNumber.slice(2, 12))
      }
      return arg
    }),
  role: z
    .string({
      invalid_type_error: 'Role Must Be String',
      required_error: 'Role is Required',
    })
    .refine(value => ValidRoles.includes(value), {
      message: 'Invalid Role Provided!',
    }),
})

export const getAllUsersSchema = z.object({
  last_index: z.coerce
    .number({
      invalid_type_error: 'Last Index should be of type number',
    }).min(0,{message:'Last Index cannot be less than Zero!'})
    .optional()
    .default(0),
  limit: z.coerce
    .number({
      invalid_type_error: 'Limit should be type of number',
    })
    .optional()
    .default(10),
})
