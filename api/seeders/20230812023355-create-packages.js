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
    await queryInterface.bulkInsert('packages', [
      { 
        id: 1, 
        name: 'develop.vol.1', 
        description: 'Development Package', 
        contract_address: '0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb',
        require_ticket: 1 
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('packages', null, {})
  }
};
