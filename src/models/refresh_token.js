'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Refresh_Token extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Refresh_Token.belongsTo(models.User, { foreignKey: 'userId' })
            // define association here
        }
    };
    Refresh_Token.init({
        userId: DataTypes.INTEGER,
        refreshToken: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Refresh_Token',
        freezeTableName: true
    });
    return Refresh_Token;
};
