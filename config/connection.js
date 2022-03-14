//import the Sequelize constructor from the library
const Sequelize = require('sequelize');

//creadt connetion to our database, pass in your MySQL information
const sequelize = new Sequelize('just_tech_news_db', 'root', 'MYSQL password', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;
