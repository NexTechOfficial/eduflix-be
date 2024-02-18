import express from 'express';
type req = express.Request;
type res = express.Response;
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      ENVIRONMENT: 'local' | 'develop' | 'stage' | 'production';
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
}

export { req, res };
