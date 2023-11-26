import {User} from './src/types'
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string
        SERVER_IP:string
        //? DATABASE CREDENTIALS
        DB_NAME: string
        DB_HOST: string
        DB_USER: string
        DB_PASSWORD: string
        DB_PORT: string
        DB_BRAND: string
        //? SERVER CREDENTIAL
        SESSION_SECRET: string
        ENCRYPTION_KEY: string
        ENVIRONMENT: 'dev' | 'stage' | 'prod'
        SERVER_URL: string //yotta-hive.com/admin
        IMAGE_SERVER_URL: string //yotta-hive.com/admin
        ADMIN_PANEL_SERVER_URL: string //yotta-hive.com
      }
    }
    namespace Express {
        export interface Request {
          user: {
            id: number;
            name:string;
            avatar:string | null;
            phone:string;
            email:string;
            city:string | null;
            date_of_birth:Date | any;
            password:string;
            password_hash:string | null;
            refered_by: string;
            role:string;
            new_user:boolean;
            conditions_accepted:boolean;
            two_step_verify:boolean;
            device_token:string | null;
            device_os:'android'| 'ios'| null;
            status:number
            [x: string]: any;
          };
        }
      }
  }
  
  export {}
  