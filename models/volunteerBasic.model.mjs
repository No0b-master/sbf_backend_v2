import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('VolunteerBasic', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    SBF_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.STRING, allowNull: false },
    blood_group: { type: DataTypes.STRING, allowNull: true },
    contact_no: { type: DataTypes.STRING },
    whatsapp_no: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    block: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    pin_code: { type: DataTypes.INTEGER },
    session: { type: DataTypes.STRING },
    valid_upto: { type: DataTypes.STRING },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'volunteer_basic_details',
    timestamps: false
  });
};
