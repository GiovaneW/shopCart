import { Router } from 'express'
import { ProductRoutes } from './product.Routes'


class ApiRoutes {
    public router: Router
    private productRoutes: ProductRoutes

    constructor() {
        this.router = Router()
        this.productRoutes = new ProductRoutes()
        this.routes()
    }

    private routes(): void {
        this.router.use('/product', this.productRoutes.router)
    }
}

export const apiRoutes = new ApiRoutes()