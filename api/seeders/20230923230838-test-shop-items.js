'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('shop_items', [
      { id: 1, title: 'Ticket x1', amount: 300, type: 'ticket', quantity: 1 },
      { id: 2, title: 'Ticket x5', amount: 1250, type: 'ticket', quantity: 5 },
      { id: 3, title: 'Ticket x10', amount: 2000, type: 'ticket', quantity: 10 }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('shop_items', null, {})
  }
};
