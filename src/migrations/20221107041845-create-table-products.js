'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            bar_code: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            price: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            tax_ipi: {
                type: Sequelize.FLOAT
            },
            in_stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            deleted_at: {
                type: Sequelize.DATE
            }
        })

        await queryInterface.addIndex('products', ['bar_code'], { unique: true, name: 'idx_products_unique_code_bar', where: { deleted_at: null } })
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('products', 'idx_products_unique_code_bar')
        await queryInterface.dropTable('products', { force: true })
    }
}
