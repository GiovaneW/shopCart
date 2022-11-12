import { Router } from 'express'
import { ProductController } from '../controllers/productController'

export class ProductRoutes {
    public router: Router
    private productCtl: ProductController
    constructor() {
        this.router = Router()
        this.productCtl = new ProductController()
        this.routes()
    }

    private routes(): void {
        this.router.get('/', this.productCtl.listProducts)
        this.router.get('/:id', this.productCtl.getProduct)
        this.router.post('/', this.productCtl.registerProduct)
        this.router.patch('/:id', this.productCtl.updateProduct)
        this.router.delete('/:id', this.productCtl.deleteProduct)
    }
}
