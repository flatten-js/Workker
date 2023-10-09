'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(Project, { foreignKey: 'user_id' })
      Project.belongsTo(models.User)
    }
  }
  Project.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    radius: DataTypes.INTEGER,
    charge: DataTypes.FLOAT,
    public: DataTypes.BOOLEAN,
    distance: DataTypes.FLOAT,
    description: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
    underscored: true,
    paranoid: true
  });
  return Project;
};