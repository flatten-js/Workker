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
    await queryInterface.addColumn('projects', 'user_id', { type: Sequelize.INTEGER })
    await queryInterface.addColumn('projects', 'public', { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('projects', 'user_id')
    await queryInterface.removeColumn('projects', 'public')
  }
};
