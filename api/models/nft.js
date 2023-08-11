'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Nft.belongsTo(models.Package)
      models.Package.hasMany(Nft, { foreignKey: 'package_id' })

      Nft.belongsTo(models.User)
      models.User.hasMany(Nft, { foreignKey: 'user_id' })
    }
  }
  Nft.init({
    user_id: DataTypes.INTEGER,
    package_id: DataTypes.INTEGER,
    token_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Nft',
    underscored: true,
  });
  return Nft;
};