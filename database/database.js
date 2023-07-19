const Sequelize = require('sequelize');

const connection = new Sequelize('guiapress', 'root', 'C@nt0930511', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
})


module.exports = connection; 