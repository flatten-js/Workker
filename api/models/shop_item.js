'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShopItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ShopItem.init({
    title: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    type: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    disabled: DataTypes.BOOLEAN,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ShopItem',
    underscored: true,
  });
  return ShopItem;
};