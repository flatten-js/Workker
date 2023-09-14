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
      ProjectReport.belongsTo(models.Project)
      models.Project.hasMany(ProjectReport, { foreignKey: 'project_id' })
    }
  }
  ProjectReport.init({
    project_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProjectReport',
    underscored: true,
  });
  return ProjectReport;
};