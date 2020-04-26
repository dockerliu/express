'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    articleId: DataTypes.INTEGER,
    context: DataTypes.TEXT
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    // 定义关连关系 ，一个评论只属于一篇文章
    models.Comment.belongsTo(models.Article)
  };
  return Comment;
};