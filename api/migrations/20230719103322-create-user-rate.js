'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_rates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rate_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      count: {
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

    await queryInterface.addConstraint('user_rates', {
      fields: ['rate_id', 'user_id'],
      type: 'unique',
      name: 'user_rates_rate_id_user_id_unique'
    })

    await queryInterface.addConstraint('user_rates', {
      fields: ['rate_id'],
      type: 'foreign key',
      name: 'user_rates_rate_id_foreign_rates_id',
      references: {
        table: 'rates',
        field: 'id'
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_rates');
  }
};