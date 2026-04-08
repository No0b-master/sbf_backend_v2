'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'authMethod', {
      type: Sequelize.ENUM('normal', 'google'),
      defaultValue: 'normal',
      allowNull: false
    });

    await queryInterface.addColumn('users', 'dob', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'authMethod');
    await queryInterface.removeColumn('users', 'dob');
  }
};
