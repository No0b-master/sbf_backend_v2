"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("volunteer_basic_details", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      SBF_id: { type: Sequelize.STRING, allowNull: false, unique: true },
      name: { type: Sequelize.STRING, allowNull: false },
      dob: { type: Sequelize.STRING, allowNull: false },
      blood_group: { type: Sequelize.STRING, allowNull: false },
      contact_no: { type: Sequelize.STRING },
      whatsapp_no: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      block: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      district: { type: Sequelize.STRING },
      pin_code: { type: Sequelize.INTEGER },
      session: { type: Sequelize.STRING },
      valid_upto: { type: Sequelize.STRING },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: false },
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
    await queryInterface.dropTable("volunteer_basic_details");
  },
};
