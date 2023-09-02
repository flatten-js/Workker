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
      // define association here
    }
  }
  Project.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    radius: DataTypes.FLOAT,
    public: DataTypes.BOOLEAN,
    ticket: DataTypes.INTEGER,
    distance: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Project',
    underscored: true,
  });
  return Project;
};