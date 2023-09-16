'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PackageNft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Package.hasMany(PackageNft, { foreignKey: 'package_id' })
      PackageNft.belongsTo(models.Package)
    }
  }
  PackageNft.init({
    package_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    rate: DataTypes.FLOAT,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PackageNft',
    underscored: true,
  });
  return PackageNft;
};