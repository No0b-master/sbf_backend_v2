"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("volunteer_status", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      SBF_id: { type: Sequelize.STRING, allowNull: false, unique: true },
      local_level: { type: Sequelize.BOOLEAN },
      state_level: { type: Sequelize.BOOLEAN },
      national_level: { type: Sequelize.BOOLEAN },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("volunteer_status");
  },
};
