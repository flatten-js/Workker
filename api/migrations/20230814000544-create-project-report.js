'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()') 
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()') 
      }
    });

    await queryInterface.addConstraint('project_reports', {
      fields: ['project_id'],
      type: 'foreign key',
      name: 'project_reports_project_id_foreign_projects_id',
      references: {
        table: 'projects',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

    await queryInterface.addConstraint('project_reports', {
      fields: ['project_id', 'user_id'],
      type: 'unique',
      name: 'project_reports_project_id_user_id_unique'
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('project_reports');
  }
};