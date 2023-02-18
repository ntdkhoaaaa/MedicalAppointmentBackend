'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinics extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Clinics.hasMany(models.Doctor_Infor, { foreignKey: 'clinicId', as: 'clinicData' })
            Clinics.hasMany(models.Medicine, { foreignKey: 'clinicId', as: 'medicineData' })

            // Specialty.hasMany(models.Doctor_Infor, { foreignKey: 'specialtyId', as: 'specialtyData' })

            // define association here
        }
    };
    Clinics.init({
        name: DataTypes.STRING,
        nameEn: DataTypes.STRING,
        address: DataTypes.STRING,
        addressEn: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT,
        image: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Clinics',
    });
    return Clinics;
};
