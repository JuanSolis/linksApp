const mysql = require('mysql');
const {promisify} = require('util');
const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((error,connection) => {
    if (error) {
        if(error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('DATABASE CONNECTION WAS CLOSES');
        }
        if(error.code === 'ERR_CON_ERROR') {
            console.log('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (error.code === 'ECONNREFUSED') {
            console.log('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if (connection) {
        console.log('DB is Connected');
        return;
    }
});
pool.query = promisify(pool.query);

module.exports = pool;