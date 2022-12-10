'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {

      // define association here
    }
  };
  Rating.init({
    comment: DataTypes.TEXT,
    rate: DataTypes.INTEGER,
    bookingId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};
