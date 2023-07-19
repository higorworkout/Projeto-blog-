const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require('../categories/Category')


const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false 
    }, body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article); // there are many 1pM
Article.belongsTo(Category); // One article belongs to a category 1p1

module.exports = Article;