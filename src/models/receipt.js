'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Receipt extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Receipt.belongsTo(models.History, { foreignKey: 'historyId', targetKey: 'id', as: 'receiptData' })
            // define association here
        }
    };
    Receipt.init({
        historyId: DataTypes.INTEGER,
        medicineName: DataTypes.STRING,
        unit: DataTypes.STRING, //don vi tinh
        quantity: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Receipt',
    });
    return Receipt;
};
