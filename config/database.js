const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'airbnb-database.c2itfs4eya1g.ap-northeast-2.rds.amazonaws.com',
    user: 'nada',
    port: '3306',
    password: 'qwer1234**',
    database: 'Airbnb_DB'
});

module.exports = {
    pool: pool
};