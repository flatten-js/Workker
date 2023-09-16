'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'users' },
        onUpdate: 'restrict',
        onDelete: 'restrict'
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      radius: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      public: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ticket: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      distance: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      description: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      deleted_at: {
        type: Sequelize.DATE
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  }
};