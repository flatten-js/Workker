'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nfts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      package_id: {
        type: Sequelize.INTEGER
      },
      token_id: {
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

    await queryInterface.addConstraint('nfts', {
      fields: ['package_id'],
      type: 'foreign key',
      name: 'nfts_package_id_foreign_packages_package_id',
      references: {
        table: 'packages',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

    await queryInterface.addConstraint('nfts', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'nfts_user_id_foreign_users_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

    await queryInterface.addConstraint('nfts', {
      fields: ['package_id', 'token_id'],
      type: 'unique',
      name: 'nfts_package_id_token_id_unique'
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('nfts');
  }
};