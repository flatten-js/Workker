'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stamp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Marker.hasMany(Stamp, { foreignKey: 'marker_id' })
      Stamp.belongsTo(models.Marker)
      models.User.hasMany(Stamp, { foreignKey: 'user_id' })
      Stamp.belongsTo(models.User)
    }
  }
  Stamp.init({
    user_id: DataTypes.INTEGER,
    marker_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Stamp',
    underscored: true,
  });
  return Stamp;
};