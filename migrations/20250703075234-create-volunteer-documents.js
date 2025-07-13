"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("volunteer_documents", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      SBF_id: { type: Sequelize.STRING, allowNull: false, unique: true },
      qualification_doc: { type: Sequelize.STRING, allowNull: false },
      adhaar_card: { type: Sequelize.STRING, allowNull: false },
      pan_card: { type: Sequelize.STRING, allowNull: false },
      photo: { type: Sequelize.STRING },
      character_certificate: { type: Sequelize.STRING },
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
    await queryInterface.dropTable("volunteer_documents");
  },
};
