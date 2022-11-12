'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query('CREATE EXTENSION unaccent')
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query('DROP EXTENSION unaccent')
    }
}
