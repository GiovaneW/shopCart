'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products_shop_carts', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            shop_cart_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'shop_carts',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            cost: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            tax_value: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0
            },
            per_discount: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0
            },
            val_discount: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0
            },
            item_subtotal: {
                type: Sequelize.FLOAT,
                allowNull: false
            }
        })

        await queryInterface.addIndex('products_shop_carts', ['product_id', 'shop_cart_id'], { name: 'idx_products_shop_carts_unique_shop_cart_product', unique: true })
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('products_shop_carts', 'idx_products_shop_carts_unique_shop_cart_product')
        await queryInterface.dropTable('proucts_shop_carts', { force: true })
    }
}
