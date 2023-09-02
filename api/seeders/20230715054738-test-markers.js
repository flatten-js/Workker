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
    await queryInterface.bulkInsert('markers', [
      { id: 1, project_id: 1, title: 'A', description: 'A', stamp_icon: '', position: '{ "lat": 35.31017111977804, "lon": 139.47948164020053 }' },
      { id: 2, project_id: 1, title: 'B', description: 'B', stamp_icon: '', position: '{ "lat": 35.29958568898158, "lon": 139.48077571365295 }', radius: 50 },
      { id: 3, project_id: 2, title: 'A', description: 'A', stamp_icon: '', position: '{ "lat": 35.31017111977804, "lon": 139.47948164020053 }' },
      { id: 4, project_id: 2, title: 'B', description: 'B', stamp_icon: '', position: '{ "lat": 35.29958568898158, "lon": 139.48077571365295 }', radius: 50 }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('markers', null, {})
  }
};
