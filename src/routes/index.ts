import { Router } from 'express'
import { ProductRoutes } from './product.Routes'
import { ShopCartRoutes } from './shopCart.Routes'


class ApiRoutes {
    public router: Router
    private productRoutes: ProductRoutes
    private shopCartRoutes: ShopCartRoutes

    constructor() {
        this.router = Router()
        this.productRoutes = new ProductRoutes()
        this.shopCartRoutes = new ShopCartRoutes()
        this.routes()
    }

    private routes(): void {
        this.router.use('/product', this.productRoutes.router)
        this.router.use('/shop-cart', this.shopCartRoutes.router)
    }
}

export const apiRoutes = new ApiRoutes()