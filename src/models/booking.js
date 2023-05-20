'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Booking.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id', as: 'patientData' })
            Booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataPatient' })
            Booking.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorInfoData' })
            Booking.hasOne(models.History, { foreignKey: 'bookingId' })
            Booking.hasOne(models.Rating, { foreignKey: 'bookingId' })

        }
    };
    Booking.init({
        statusId: DataTypes.STRING,
        doctorId: DataTypes.INTEGER,
        patientId: DataTypes.STRING,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,
        prognostic: DataTypes.STRING,
        forWho: DataTypes.STRING,
        bookingDate: DataTypes.STRING,
        patientAge: DataTypes.STRING,
        address: DataTypes.STRING,
        gender: DataTypes.STRING,
        token: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        clinicId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
        pathology: DataTypes.STRING,
        bloodType: DataTypes.STRING,
        weight: DataTypes.STRING,
        height: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Booking',
        freezeTableName: true
    });
    return Booking;
};
