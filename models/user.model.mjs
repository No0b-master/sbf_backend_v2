import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      SBF_id: { type: DataTypes.STRING, unique: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      state: { type: DataTypes.STRING },
      userType: { type: DataTypes.INTEGER, defaultValue: 4 },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
};
