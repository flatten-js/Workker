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
      { id: 1, project_id: 1, title: 'Spot 1', description: 'Spot 1 Description...', stamp_icon: '', position: '35.31017111977804,139.47948164020053' },
      { id: 2, project_id: 1, title: 'Spot 2', description: 'Spot 2 Description...', stamp_icon: '', position: '35.29958568898158,139.48077571365295', radius: 50 },
      { id: 3, project_id: 2, title: 'Spot 1', description: 'Spot 1 Description...', stamp_icon: '', position: '35.31017111977804,139.47948164020053' },
      { id: 4, project_id: 2, title: 'Spot 2', description: 'Spot 2 Description...', stamp_icon: '', position: '35.29958568898158,139.48077571365295', radius: 50 }
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
