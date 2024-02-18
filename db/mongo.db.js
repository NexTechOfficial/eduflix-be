//@ts-check
const mongoose = require('mongoose');
const { DATABASE, HOST, DB_PORT, PASSWORD, USER, ENVIRONMENT } = process.env;
exports.connectMongoDB = async function () {
    /**
     * @type {string} ConnectionUrl
     */
    let ConnectionUrl;
    if (ENVIRONMENT == 'local') {
      ConnectionUrl = `mongodb://${HOST}:${DB_PORT}/${DATABASE}`;
    } else {
      ConnectionUrl = `mongodb://${USER}:${PASSWORD}@${HOST}:${DB_PORT}/${DATABASE}`;
    }
    await mongoose.connect(ConnectionUrl);
};
