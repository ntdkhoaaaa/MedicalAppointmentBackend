'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_Clinic_Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Doctor_Clinic_Specialty.belongsTo(models.User, { foreignKey: 'doctorId' })
            Doctor_Clinic_Specialty.belongsTo(models.ClinicSpecialty, { foreignKey: 'specialtyId', targetKey: 'id', as: 'specialtyData' })
            Doctor_Clinic_Specialty.belongsTo(models.Clinics, { foreignKey: 'clinicId', targetKey: 'id', as: 'clinicData' })
        }
    };
    Doctor_Clinic_Specialty.init({
        doctorId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
        count: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Doctor_Clinic_Specialty',
        freezeTableName: true

    });
    return Doctor_Clinic_Specialty;
};
