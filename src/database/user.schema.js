//@ts-check
const { Schema, model } = require('mongoose');
const { UserRoles, Status } = require('../../config');
const table_name = 'users';
const UserDef = new Schema(
  {
    id: {
      type: Number,
      required: [true, 'ID is required'],
      unique:true
    },
    first_name: {
      type: String,
      required: [true, 'First Name is Required'],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, 'Last Name is Required'],
      trim: true,
    },
    date_of_birth: {
      type: Date,
      required: [true, 'Date of Birts is Required'],
    },
    avatar: { type: String , default:null },
    phone: {
      type: String,
      required: [true, 'Phone Number is Required'],
      validate: {
        validator: PhNumber => /^[0-9]{10,12}$/.test(PhNumber),
        message: result => `${result.value} is an Invalid phone number!`,
      },
      trim: true,
    },
    email: {
      type: String,
      validate: {
        validator: mail =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail),
        message: props => `${props.value} is an Invalid E-Mail!`,
      },
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: { type: String, trim: true, nullable: true, default: null },
    type: {
      type: String,
      lowercase: true,
      trim: true,
      default: UserRoles.STUDENT,
      enum: [UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.TEACHER],
    },
    is_new_user: {
      type: Boolean,
      default: true,
    },
    last_online: {
      type: Date,
      default: new Date(),
    },
    otp:{
        type:Number,
        default: null,
        require:true
    },
    password:{
        type:String,
        required:false,
        default:null,
    },
    is_email_verified:{
      type:Boolean,
      default:false,
    },
    is_phone_verified:{
      type:Boolean,
      default:false,
    },
    tick_mark:{
      type:Number,
      required:false,
      default:null,
    },
    status: {
      type: Number,
      default: Status.ACTIVE,
      enum: [Status.ACTIVE, Status.IN_ACTIVE, Status.DELETED, Status.BANNED],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, versionKey: false }
);

exports.UserDoc  = model(table_name,UserDef);
