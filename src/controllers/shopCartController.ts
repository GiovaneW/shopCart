import { NextFunction, Request, Response } from 'express'
import { QueryTypes, Transaction } from 'sequelize'
import sequelizeConnection from '../config/database'
import { Product } from '../models/product'
import { ProductShopCart } from '../models/productShopCart'
import { ShopCart } from '../models/shopCart'
import { AppError, NotFoundError, WeeValidationError } from '../utils/awesomeErrorsManage'
import { v4 } from 'uuid'
import { addDays } from 'date-fns'

export class ShopCartController {
    public async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const cart = await ShopCart.findOne({
                where: {
                    id
                },
                // include: [
                //     {
                //         model: ProductShopCart,
                //         as: 'Items',
                //         include: [
                //             {
                //                 model: Product,
                //                 as: 'Product'
                //             }
                //         ]
                //     }
                // ]
            })
            if (!cart) throw new NotFoundError('Carrinho não encontrado.')
            if (cart.expiresIn < new Date()) throw new WeeValidationError('Infelizmente este carrinho já expirou.')

            const items = await ProductShopCart.findAll({
                where: {
                    shopCartId: cart.id
                },
                include: [
                    {
                        model: Product,
                        as: 'Product'
                    }
                ]
            })

            res.json({ cart, data: items })
        } catch (error) {
            next(error)
        }
    }

    public async addProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        const transaction = await sequelizeConnection.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED })
        try {
            const { shopCartId, productId, amount, percentDiscount } = req.body
            let cart: ShopCart | null = null
            if (!shopCartId) {
                cart = await ShopCart.create({
                    cartToken: v4(),
                    createdAt: new Date(),
                    expiresIn: addDays(new Date(), 15),
                    isClosed: false,
                    totalCart: 0,
                    totalProducts: 0,
                    totalTax: 0
                }, { transaction })
            } else {
                cart = await ShopCart.findOne({
                    where: {
                        id: shopCartId
                    }
                })
            }

            if (!cart) throw new NotFoundError('Carrinho não encontrado.')
            if (cart.expiresIn < new Date()) throw new WeeValidationError('Este carrinho já expirou.')

            const product = await Product.count({
                where: {
                    id: productId
                }
            })

            if (product === 0) throw new NotFoundError('Produto não encontrado.')

            let productCart = await ProductShopCart.findOne({
                where: {
                    shopCartId,
                    productId
                }
            })

            if (productCart) throw new WeeValidationError('Este produto já está no seu carrinho. Caso deseje, adicione mais unidades pelo carrinho de compras.')

            productCart = await ProductShopCart.create({
                productId,
                shopCartId: cart.id,
                perDiscount: Math.fround(Number.parseFloat(percentDiscount) / 100),
                amount: Number.parseInt(amount),
                cost: 0,
                itemSubtotal: 0,
                taxValue: 0,
                valDiscount: 0
            }, {
                transaction
            })

            cart = await cart.save({ transaction })

            await transaction.commit()

            res.json(cart)
        } catch (error) {
            await transaction.rollback()
            next(error)
        }
    }


    public async createCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const transaction = await sequelizeConnection.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED })
        try {

            let { productId, amount, percentDiscount } = req.body


            let cart = await ShopCart.create({
                cartToken: 'cart',
                isClosed: false,
                totalCart: 0.0,
                totalProducts: 0.0,
                totalTax: 0.0,
                createdAt: new Date(),
                expiresIn: addDays(new Date(), 15)
            }, {
                transaction
            })

            if (productId) {
                if (!amount) throw new WeeValidationError('Quantidade é obrigatoria par aadicionar produto ao carrinho')
                if (!percentDiscount) percentDiscount = 0

                ProductShopCart.create({
                    productId,
                    shopCartId: cart.id as number,
                    perDiscount: percentDiscount,
                    amount,
                    cost: 0,
                    itemSubtotal: 0,
                    taxValue: 0,
                    valDiscount: 0
                }, {
                    isNewRecord: true,
                    transaction
                })
            }

            cart = await cart.save({ transaction })

            await transaction.commit()
            res.json(cart)

        } catch (error) {
            await transaction.rollback()
            next(error)
        }
    }

    public async closeCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const cart = await ShopCart.findOne({
                where: {
                    id
                }
            })

            if (!cart) throw new NotFoundError('Carrinho não encontrado.')
            if (cart.expiresIn < new Date()) throw new WeeValidationError('Este carrinho já expirou.')

            cart.isClosed = true
            await cart.save()

            res.json({ success: true })
        } catch (error) {
            next(error)
        }
    }

    public async removeProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        const transaction = await sequelizeConnection.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED })
        try {
            const productCart = await ProductShopCart.findOne({
                where: {
                    productId: req.params.productId
                }
            })

            if (!productCart) throw new NotFoundError('Produto não localizado dentro deste carrinho.')

            const cart = await ShopCart.findOne({
                where: {
                    id: productCart.shopCartId
                }
            })

            if (!cart) throw new NotFoundError('Carrinho nao encontrado.')
            if (cart?.expiresIn < new Date()) throw new WeeValidationError('Carrinho já expirou.')

            await productCart.destroy({ transaction })

            await cart.save({ transaction })

            await transaction.commit()
            res.json({ removed: true })

        } catch (error) {
            await transaction.rollback()
            next(error)
        }
    }

    public async updateProductInCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const transaction = await sequelizeConnection.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED })
        try {
            const { amount, percentDiscount, productId } = req.body
            const productCart = await ProductShopCart.findOne({
                where: {
                    productId,
                    shopCartId: req.params.id
                }
            })

            if (!productCart) throw new NotFoundError('Produto não encontrado no carrinho.')

            if (percentDiscount && productCart.perDiscount != Math.fround(Number.parseFloat(percentDiscount) / 100)) {
                productCart.perDiscount = Math.fround(Number.parseFloat(percentDiscount) / 100)
            }

            if (amount && Number.parseInt(amount) != productCart.amount) {
                productCart.amount = amount
            }

            if (productCart.amount <= 0) {
                await productCart.destroy({ transaction })
            } else {
                await productCart.save({ transaction })
            }

            const cart = await ShopCart.findOne({ where: { id: productCart.shopCartId }, transaction })
            if (!cart) throw new AppError('Erro ao atualizar o produto do carrinho.', 500)

            await cart.save({ transaction })
            await transaction.commit()
            res.json(cart)

        } catch (error) {
            await transaction.rollback()
            next(error)
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const transaction = await sequelizeConnection.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED })
        try {
            await ShopCart.destroy({
                where: {
                    id: req.params.id
                },
                transaction
            })

            await transaction.commit()
            res.json({ success: true })

        } catch (error) {
            transaction.rollback()
            next(error)
        }
    }
}