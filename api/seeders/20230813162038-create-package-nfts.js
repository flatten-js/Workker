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
    await queryInterface.bulkInsert('package_nfts', [
      { id: 1, package_id: 1, name: 'A', description: 'Development NFT', rate: 5 },
      { id: 2, package_id: 1, name: 'B', description: 'Development NFT', rate: 25 },
      { id: 3, package_id: 1, name: 'C', description: 'Development NFT', rate: 70 },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('package_nfts', null, {})
  }
};
