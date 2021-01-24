const mysql = require('mysql2');


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Vishwa@123',
    database: 'node-schema'
})

module.exports = pool.promise();