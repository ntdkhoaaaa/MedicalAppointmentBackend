'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' })
      User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })
      User.hasOne(models.Markdown, { foreignKey: 'doctorId' })
      User.hasOne(models.Doctor_Infor, { foreignKey: 'doctorId' })
      User.hasOne(models.UserMedicalInformation, { foreignKey: 'patientId' })
      User.hasOne(models.Refresh_Token, { foreignKey: 'userId' })
      User.hasMany(models.Schedule, { foreignKey: 'doctorId', as: 'doctorData' })
      User.hasMany(models.Booking, { foreignKey: 'patientId', as: 'patientData' })
      User.hasMany(models.Booking, { foreignKey: 'doctorId', as: 'doctorInfoData' })
      // define association here
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
    statusId: DataTypes.STRING,
    clinicId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
