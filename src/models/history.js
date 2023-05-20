'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class History extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            History.belongsTo(models.Booking, { foreignKey: 'bookingId' })
            History.hasMany(models.Receipt, { foreignKey: 'historyId', as: 'receiptData' })
        }
    };
    History.init({
        bookingId: DataTypes.INTEGER,
        medicineRange: DataTypes.INTEGER,
        medicalRecords: DataTypes.TEXT,
        date:DataTypes.STRING
    }, {
        sequelize,
        modelName: 'History',
    });
    return History;
};
