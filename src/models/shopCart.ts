import { addDays } from 'date-fns'
import { DataTypes, Model, QueryTypes, Sequelize, Transaction } from 'sequelize'
import sequelizeConnection from '../config/database'
import { Product } from './product'
import { ProductShopCart } from './productShopCart'

interface IShopCart {
    id?: number
    cartToken: string
    createdAt?: Date
    expiresIn?: Date
    isClosed: boolean
    totalCart: number
    totalTax: number
    totalProducts: number
}

interface ISumming {
    sum_cost: number
    sum_tax: number
    sum_discount: number
    sum_sub_total: number
}

export class ShopCart extends Model<IShopCart> {
    public id!: number
    public cartToken!: string
    public createdAt!: Date
    public expiresIn!: Date
    public isClosed!: boolean
    public totalTax!: number
    public totalProducts!: number
    public totalCart!: number

    // don`t lie, i`m just wanna cry for that
    public _transaction?: Transaction

    async calculateTotal(): Promise<void> {
        const summing = await this.sequelize.query<ISumming>(`select 
        coalesce(sum(p.cost), 0) as sum_cost, 
        coalesce(sum(p.tax_value), 0) as sum_tax, 
        coalesce(sum(p.val_discount), 0) as sum_discount, 
        coalesce(sum(p.item_subtotal), 0) as sum_sub_total 
        from products_shop_carts as p where p.shop_cart_id = '${this.id}'`,
            {
                type: QueryTypes.SELECT,
                transaction: this._transaction
            }
        )
        if (summing.length > 0) {
            const summ: ISumming = summing[0]

            this.totalProducts = summ.sum_cost - summ.sum_discount
            this.totalTax = summ.sum_tax
            this.totalCart = summ.sum_sub_total
        }
    }

    setValidity(): void {
        if (!this.id) {
            this.createdAt = new Date()
            this.expiresIn = addDays(this.createdAt, 15)
        } else {
            this.expiresIn = addDays(new Date(), 15)
        }
    }
}

ShopCart.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    cartToken: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Um token de carrinho de compras não foi gerado.' }
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: { msg: 'Data da criação do carrinho não foi atribuída' },
            isDate: { args: false, msg: 'Data de criação do carrinho fora do padrão' }
        },
        defaultValue: new Date()
    },
    expiresIn: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: { msg: 'O carrinho de compras necessita uma validade.' },
            isDate: { args: false, msg: 'Data de validade do carrinho fora do padrão' }
        }
    },
    isClosed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    totalCart: {
        type: DataTypes.FLOAT
    },
    totalTax: {
        type: DataTypes.FLOAT
    },
    totalProducts: {
        type: DataTypes.FLOAT
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: false,
    timestamps: false,
    underscored: true,
    schema: 'public',
    tableName: 'shop_carts',
    modelName: 'ShopCart',
    hooks: {
        beforeValidate: (instance) => {
            instance.setValidity()
        },
        beforeSave: async (instance, options): Promise<void> => {
            if (options.transaction) instance._transaction = options.transaction
            if (instance.id)
                await instance.calculateTotal()
        },
        beforeUpdate: async (instance, options): Promise<void> => {
            if (options.transaction) instance._transaction = options.transaction
            if (instance.id)
                await instance.calculateTotal()
        },
        beforeCreate: async (instance, options): Promise<void> => {
            if (options.transaction) instance._transaction = options.transaction
            if (instance.id)
                await instance.calculateTotal()
        },
        beforeBulkCreate: async (instances, options): Promise<void> => {
            for await (const instance of instances) {
                if (options.transaction) instance._transaction = options.transaction
                if (instance.id)
                    await instance.calculateTotal()
            }
        }
    }
})



// ShopCart.belongsToMany(Product, {
//     through: {
//         model: ProductShopCart,
//         unique: true
//     },
//     as: 'Products'
// })