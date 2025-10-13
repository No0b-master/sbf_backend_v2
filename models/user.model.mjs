import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      SBF_id: { type: DataTypes.STRING, unique: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        allowNull: true,
        defaultValue: null,
      },
      password: { type: DataTypes.STRING, allowNull: false },
      state: { type: DataTypes.STRING },
      userType: { type: DataTypes.INTEGER, defaultValue: 4 },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        unique: true,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
};
