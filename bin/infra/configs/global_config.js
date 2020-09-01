require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  basicAuthApi: [
    {
      username: process.env.BASIC_AUTH_USERNAME,
      password: process.env.BASIC_AUTH_PASSWORD
    }
  ],
  publicKey: process.env.PUBLIC_KEY_PATH,
  privateKey: process.env.PRIVATE_KEY_PATH,
  postgreConfig:{
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    port: process.env.POSTGRES_PORT,
    max:  parseInt(process.env.POSTGRES_MAX),
    idleTimeoutMillis: parseInt(process.env.POSTGRES_TIMEOUT),
    ssl: {
      rejectUnauthorized: false,
    },
  }
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
