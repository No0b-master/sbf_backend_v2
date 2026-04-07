import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "PhoneVerifications",
    {
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      tableName: "PhoneVerifications",
    }
  );
};