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
    await queryInterface.addColumn('projects', 'ticket', { type: Sequelize.INTEGER, defaultValue: 0 })
    await queryInterface.addColumn('projects', 'distance', { type: Sequelize.INTEGER, defaultValue: 0 })
    await queryInterface.changeColumn('markers', 'position', {
      type: Sequelize.JSON
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('projects', 'ticket')
    await queryInterface.removeColumn('projects', 'distance')
    await queryInterface.changeColumn('markers', 'position', {
      type: Sequelize.STRING
    })
  }
};
