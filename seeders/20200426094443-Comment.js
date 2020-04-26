'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('comments', [{
        articleId: 1,
        context: '评论为1',
        createdAt:new Date(),
        updatedAt:new Date()
      },{
        articleId: 1,
        context: '评论为1-2',
        createdAt:new Date(),
        updatedAt:new Date()
      },{
        articleId: 2,
        context: '评论为2',
        createdAt:new Date(),
        updatedAt:new Date()
      }], {});
    
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('comments', null, {});
    
  }
};
