require('dotenv').config();
const mysql = require('mysql2/promise');

const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const database_name = process.env.DB_NAME;

// createPool: tạo kết nối tới MYSQL server
const mySqlPool = mysql.createPool({
    host: db_host,
    user: db_user,
    password: db_password,
    database: database_name
});

module.exports = mySqlPool;