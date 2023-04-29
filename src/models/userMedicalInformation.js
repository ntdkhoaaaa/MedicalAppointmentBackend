'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserMedicalInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        UserMedicalInformation.belongsTo(models.User, { foreignKey: 'patientId' })
    }
  };
  UserMedicalInformation.init({
    pathology: DataTypes.STRING,
    bloodType: DataTypes.STRING,
    weight: DataTypes.STRING,
    height: DataTypes.STRING,
    patientId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserMedicalInformation',
    freezeTableName: true

  });
  return UserMedicalInformation;
};
