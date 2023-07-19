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
      Marker.belongsTo(models.Project)
      models.Project.hasMany(Marker, { foreignKey: 'project_id' })
    }
  }
  Marker.init({
    project_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    stamp_icon: DataTypes.STRING,
    position: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('position').split(',')
      },
      set(v) {
        this.setDataValue('position', v.join(','))
      }
    },
    radius: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Marker',
    underscored: true,
  });
  return Marker;
};