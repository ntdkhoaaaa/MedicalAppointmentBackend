'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.Booking, { foreignKey: 'bookingId' })
      // define association here
    }
  };
  Rating.init({
    comment: DataTypes.TEXT,
    rate: DataTypes.INTEGER,
    bookingId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};
