'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shop_carts', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            cart_token: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            expires_in: {
                type: Sequelize.DATE,
                allowNull: false
            },
            is_closed: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            total_cart: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            total_tax: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            total_products: {
                type: Sequelize.FLOAT,
                allowNull: false
            }
        })
        await queryInterface.addIndex('shop_carts', ['cart_token'], { unique: true, name: 'idx_shop_carts_unique_cart_token' })
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('shop_carts', 'idx_shop_carts_unique_cart_token')
        await queryInterface.dropTable('shop_carts', { force: true })
    }
}
