'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Project.hasMany(ProjectReport, { foreignKey: 'project_id' })
      ProjectReport.belongsTo(models.Project)
    }
  }
  ProjectReport.init({
    user_id: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProjectReport',
    underscored: true,
  });
  return ProjectReport;
};