'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ClinicSpecialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ClinicSpecialty.belongsTo(models.Clinics, { foreignKey: 'clinicId',targetKey:'id', as: 'clinicData' })
            // define association here
            ClinicSpecialty.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceDataForHospital' })
            ClinicSpecialty.hasMany(models.Booking, { foreignKey: 'specialtyId', as: 'bookingSpecialtyData' })
            ClinicSpecialty.hasMany(models.Doctor_Infor, { foreignKey: 'specialtyId', as: 'ClinicSpecialtyData' })
        }
    };
    ClinicSpecialty.init({
        name: DataTypes.STRING,
        nameEn: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT,
        image: DataTypes.STRING,
        clinicId: DataTypes.INTEGER,
        location: DataTypes.STRING,
        locationEn: DataTypes.STRING,
        priceId:DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'ClinicSpecialty',
    });
    return ClinicSpecialty;
};
