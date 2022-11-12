import { Router } from 'express'
import { ShopCartController } from '../controllers/shopCartController'

export class ShopCartRoutes {
    public router: Router
    private shopCartCtl: ShopCartController

    constructor() {
        this.router = Router()
        this.shopCartCtl = new ShopCartController()
        this.routes()
    }

    private routes(): void {
        this.router.get('/:id', this.shopCartCtl.getCart)
        this.router.post('/', this.shopCartCtl.createCart)
        this.router.put('/', this.shopCartCtl.addProduct)
        this.router.put('/:id', this.shopCartCtl.updateProductInCart)
        this.router.patch('/:id', this.shopCartCtl.closeCart)
        this.router.delete('/:id', this.shopCartCtl.delete)
        this.router.delete('/remove-product/:productId', this.shopCartCtl.removeProduct)
    }
}