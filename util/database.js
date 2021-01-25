const Sequelize = require('sequelize');

let sequelize = new Sequelize('node-schema', 'root', 'Vishwa@123', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'Vishwa@123',
//     database: 'node-schema'
// })

// module.exports = pool.promise();