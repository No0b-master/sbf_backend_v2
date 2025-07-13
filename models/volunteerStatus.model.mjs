import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('VolunteerStatus', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    SBF_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    local_level: { type: DataTypes.BOOLEAN },
    state_level: { type: DataTypes.BOOLEAN },
    national_level: { type: DataTypes.BOOLEAN }
  }, {
    tableName: 'volunteer_status',
    timestamps: false
  });
};
