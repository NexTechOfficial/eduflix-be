import {z} from 'zod';
export const UserSchema = z
  .object({
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
  })