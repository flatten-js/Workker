'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserRate.belongsTo(models.Rate)
      models.Rate.hasMany(UserRate, { foreignKey: 'rate_id' })
    }
  }
  UserRate.init({
    rate_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserRate',
    underscored: true,
  });
  return UserRate;
};