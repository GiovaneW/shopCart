import { DataTypes, Model } from 'sequelize'
import sequelizeConnection from '../config/database'
import { Product } from './product'
import { ShopCart } from './shopCart'

interface IProductShopCart {
    id?: number
    productId: number
    shopCartId: number
    amount: number
    cost: number
    taxValue: number
    perDiscount: number
    valDiscount: number
    itemSubtotal: number
}

export class ProductShopCart extends Model<IProductShopCart> {
    public id!: number
    public productId!: number
    public shopCartId!: number
    public amount!: number
    public cost!: number
    public taxValue!: number
    public perDiscount!: number
    public valDiscount!: number
    public itemSubtotal!: number

    async calculateIncluding(): Promise<void> {
        const product = await Product.findOne({
            where: {
                id: this.productId
            }
        })
        if (product) {
            this.cost = product.price * this.amount
            this.valDiscount = this.cost * this.perDiscount
            this.taxValue = this.cost * product.taxIpi
            this.itemSubtotal = this.cost - this.valDiscount + this.taxValue
        }
    }
}

ProductShopCart.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shopCartId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    taxValue: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    perDiscount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    valDiscount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    itemSubtotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    }

}, {
    sequelize: sequelizeConnection,
    modelName: 'ProductShopCart',
    tableName: 'products_shop_carts',
    underscored: true,
    paranoid: false,
    timestamps: false,
    hooks: {
        beforeValidate: async (instance) => {
            await instance.calculateIncluding()
        }
    }
})

ProductShopCart.belongsTo(Product, {
    foreignKey: {
        allowNull: false,
        name: 'productId'
    },
    onDelete: 'CASCADE',
    as: 'Product'
})

ProductShopCart.belongsTo(ShopCart, {
    foreignKey: {
        allowNull: false,
        name: 'shopCartId'
    },
    onDelete: 'CASCADE',
    as: 'ShopCart'
})


Product.hasMany(ProductShopCart, {
    foreignKey: {
        allowNull: false,
        name: 'productId'
    },
    as: 'CartAssociations'
})

ShopCart.hasMany(ProductShopCart, {
    foreignKey: {
        allowNull: false,
        name: 'shopCartId'
    },
    as: 'Items'
})
