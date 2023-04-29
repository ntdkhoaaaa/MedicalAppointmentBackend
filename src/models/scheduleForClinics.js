'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ScheduleForClinics extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ScheduleForClinics.belongsTo(models.Allcode,
                {
                    foreignKey: 'timetype',
                    targetKey: 'keyMap',
                    as: 'timetypeData'
                })
            ScheduleForClinics.belongsTo(models.User, { foreignKey: 'doctorId',targetKey:'id', as: 'doctorData' })
            // ScheduleForClinics.belongsTo(models.Doctor_Infor, { foreignKey: 'doctorId',targetKey:'doctorId', as: 'doctorData' })
            ScheduleForClinics.belongsTo(models.Clinics, { foreignKey: 'clinicId',targetKey:'id', as: 'clinicData' })
            ScheduleForClinics.belongsTo(models.ClinicSpecialty, { foreignKey: 'specialtyId',targetKey:'id', as: 'specialtyData' })
            // ScheduleForClinics.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeSpecialtySchedule' })

        }
    };
    ScheduleForClinics.init({
        currentNumber: DataTypes.INTEGER,
        maxNumber: DataTypes.INTEGER,
        date: DataTypes.STRING,
        timetype: DataTypes.STRING,
        doctorId: DataTypes.INTEGER,
        picked_date: DataTypes.DATE,
        clinicId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'ScheduleForClinics',
        freezeTableName: true
    });
    return ScheduleForClinics;
};
