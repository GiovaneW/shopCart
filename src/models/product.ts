import { DataTypes, Model } from 'sequelize'
import sequelizeConnection from '../config/database'
import { ProductShopCart } from './productShopCart'
import { ShopCart } from './shopCart'

interface IProduct {
    id: number,
    description: string,
    price: number,
    taxIpi: number,
    barCode: string,
    inStock: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
}

export class Product extends Model<IProduct> {
    public id!: number
    public description!: string
    public price!: number
    public taxIpi!: number
    public barCode!: string
    public inStock!: number
    public createdAt!: Date
    public uipdatedAt!: Date
    public deletedAt!: Date | null
}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    barCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: { msg: 'Código de barras deve conter apenas números.' },
            notNull: { msg: 'Código de barras não pode ser nulo.' }
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Descrição do produto não pode ser nula.' }
        }
    },
    inStock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    taxIpi: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: true,
    underscored: true,
    schema: 'public',
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    scopes: {
        withoutStamps: {
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            }
        }
    }
})


// Product.belongsToMany(ShopCart, {
//     through: {
//         model: ProductShopCart,
//         unique: true
//     },
//     as: 'Carts'
// })