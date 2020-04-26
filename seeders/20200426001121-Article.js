'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Articles', [{
      title: 'John Doe',
      content: 'false',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // 多个数据用逗号隔开
    {
      title: 'docker liu',
      content: 'dskdfjsd',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('Articles', null, {});

  }
};
