'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Medicine extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Medicine.belongsTo(models.Clinics, { foreignKey: 'clinicId', targetKey: 'id', as: 'medicineData'  })
            // define association here
        }
    };
    Medicine.init({
        clinicId: DataTypes.INTEGER,
        nameMedicine: DataTypes.STRING,
        unit: DataTypes.STRING,
        price: DataTypes.INTEGER,

    }, {
        sequelize,
        modelName: 'Medicine',
        freezeTableName: true
    });
    return Medicine;
};
