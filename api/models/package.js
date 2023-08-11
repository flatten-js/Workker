'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Package.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    contract_address: DataTypes.STRING,
    require_ticket: DataTypes.INTEGER,
    disabled: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Package',
    underscored: true,
  });
  return Package;
};