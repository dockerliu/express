'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {});
  Article.associate = function(models) {
    // associations can be defined here
    // 定义关连关系 一篇文章可以有多个评论
    models.Article.hasMany(models.Comment)
  };
  return Article;
};