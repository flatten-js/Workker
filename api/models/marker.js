'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Marker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Project.hasMany(Marker, { foreignKey: 'project_id' })
      Marker.belongsTo(models.Project)
    }
  }
  Marker.init({
    project_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    position: DataTypes.JSON,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    radius: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Marker',
    underscored: true,
  });
  return Marker;
};