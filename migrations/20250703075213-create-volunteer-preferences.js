"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("volunteer_preferences", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      SBF_id: { type: Sequelize.STRING, allowNull: false, unique: true },
      qualification: { type: Sequelize.STRING, allowNull: false },
      skill: { type: Sequelize.STRING, allowNull: false },
      day_of_week: { type: Sequelize.STRING, allowNull: false },
      can__work_in_austere_condition: { type: Sequelize.STRING },
      deployment_duration: { type: Sequelize.STRING },
      deployment_notice: { type: Sequelize.STRING },
      evacuation_period: { type: Sequelize.STRING },
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
    await queryInterface.dropTable("volunteer_preferences");
  },
};
