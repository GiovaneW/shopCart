import { NextFunction, Request, Response } from 'express'

export class ProductController {
    public async listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('haaaaa lelek lek lek lek')
            res.json({ mesage: 'Test succesfull passed' })
        } catch (error) {
            next(error)
        }
    }

    public async getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('haaaaa lelek lek lek lek')
            res.json({ mesage: 'Test succesfull passed' })
        } catch (error) {
            next(error)
        }
    }

    public async registerProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('haaaaa lelek lek lek lek')
            res.json({ mesage: 'Test succesfull passed' })
        } catch (error) {
            next(error)
        }
    }

    public async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('haaaaa lelek lek lek lek')
            res.json({ mesage: 'Test succesfull passed' })
        } catch (error) {
            next(error)
        }
    }

    public async changeProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('haaaaa lelek lek lek lek')
            res.json({ mesage: 'Test succesfull passed' })
        } catch (error) {
            next(error)
        }
    }
}