'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeConstraint('markers', 'markers_project_id_foreign_projects_id')
    await queryInterface.removeIndex('markers', 'markers_project_id_foreign_projects_id')
    await queryInterface.addConstraint('markers', {
      fields: ['project_id'],
      type: 'foreign key',
      name: 'markers_project_id_foreign_projects_id',
      references: {
        table: 'projects',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('markers', 'markers_project_id_foreign_projects_id')
    await queryInterface.removeIndex('markers', 'markers_project_id_foreign_projects_id')
    await queryInterface.addConstraint('markers', {
      fields: ['project_id'],
      type: 'foreign key',
      name: 'markers_project_id_foreign_projects_id',
      references: {
        table: 'projects',
        field: 'id'
      }
    })
  }
};
