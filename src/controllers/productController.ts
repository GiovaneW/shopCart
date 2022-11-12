import { NextFunction, Request, Response } from 'express'
import { Transaction } from 'sequelize'
import { constants } from '../config/constants'
import sequelizeConnection from '../config/database'
import { Product } from '../models/product'
import { NotFoundError } from '../utils/awesomeErrorsManage'
import { setPages } from '../utils/paginationUtils'

export class ProductController {
    public async listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // const page = req.query.page ? Number.parseInt(req.query.page as string) - 1 : 0

            const products = await Product.scope(['withoutStamps']).findAndCountAll({
                where: {
                    deletedAt: null
                },
                // limit: constants.limitPerPage,
                // offset: constants.limitPerPage * page,
                order: [['id', 'ASC']]
            })

            // setPages(products)
            res.json({ data: products.rows })
        } catch (error) {
            next(error)
        }
    }

    public async getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const product = await Product.scope(['withoutStamps']).findOne({
                where: {
                    id
                }
            })
            if (!product) throw new NotFoundError('Produto não localizado na base de dados.')

            res.json(product)
        } catch (error) {
            next(error)
        }
    }

    public async registerProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        const transaction = await sequelizeConnection.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED })
        try {
            await Product.create(req.body, {
                transaction,
            })

            await transaction.commit()
            res.json({ mesage: 'Produto criado com sucesso.' })
        } catch (error) {
            await transaction.rollback()
            next(error)
        }
    }

    public async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        const transaction = await sequelizeConnection.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED })
        try {
            const { id } = req.params
            const product = await Product.scope(['withoutStamps']).findOne({
                where: {
                    id
                }
            })

            if (!product) throw new NotFoundError('Produto não encontrado.')

            await product.update(req.body, {
                transaction
            })

            await transaction.commit()

            res.json({ mesage: 'Produto atualizado com sucesso.' })
        } catch (error) {
            await transaction.rollback()
            next(error)
        }
    }

    public async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        const transaction = await sequelizeConnection.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED })
        try {
            const { id } = req.params
            const product = await Product.findOne({
                where: {
                    id
                }
            })

            if (!product) throw new NotFoundError('Produto não encontrado.')

            await product.destroy({
                transaction
            })

            await transaction.commit()
            res.json({ success: true })
        } catch (error) {
            await transaction.rollback()
            next(error)
        }
    }
}