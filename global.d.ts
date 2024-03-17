import express from 'express';
import mongoose from 'mongoose';
type req = express.Request;
type res = express.Response;
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      ENVIRONMENT: 'local' | 'develop' | 'stage' | 'production';
      ENCRYPTION_KEY:string;
      //? DATABASE CREDENTIALS
      DATABASE: string;
      HOST: string;
      USER: string;
      PASSWORD: string;
      DB_PORT: string;
      //? E-Mail
      SMTP_MAIL: string;
      SMTP_PASS: string;
    }
  }
  namespace Express {
    export interface Request {
      user: {
        user_obj_id : string,
        user_int_id : number,
        id: number,
        first_name: string,
        last_name: string,
        date_of_birth: Date,
        avatar: string | null,
        phone: string,
        email: string | null | undefined,
        address: string | null,
        type: string,
        is_new_user: boolean,
        last_online: Date,
        otp:number | null,
        is_email_verified:boolean,
        is_phone_verified:boolean,
        tick_mark:number | null | undefined,
        status: number,
      };
    }
  }
}

export { req, res };
