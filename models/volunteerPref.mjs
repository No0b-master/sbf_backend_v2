import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('VolunteerPreference', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    SBF_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    qualification: { type: DataTypes.STRING, allowNull: false },
    skill: { type: DataTypes.STRING, allowNull: false },
    day_of_week: { type: DataTypes.STRING, allowNull: false },
    can__work_in_austere_condition: { type: DataTypes.STRING },
    deployment_duration: { type: DataTypes.STRING },
    deployment_notice: { type: DataTypes.STRING },
    evacuation_period: { type: DataTypes.STRING }
  }, {
    tableName: 'volunteer_preferences',
    timestamps: false
  });
};
