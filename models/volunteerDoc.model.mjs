import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "VolunteerDocuments",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      SBF_id: { type: DataTypes.STRING, allowNull: false, unique: true },
      qualification_doc: { type: DataTypes.STRING, allowNull: false },
      adhaar_card: { type: DataTypes.STRING, allowNull: false },
      pan_card: { type: DataTypes.STRING, allowNull: false },
      photo: { type: DataTypes.STRING },
      character_certificate: { type: DataTypes.STRING },
    },
    {
      tableName: "volunteer_documents",
      timestamps: false,
    }
  );
};


