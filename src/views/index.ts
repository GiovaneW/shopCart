import { Request, Response, Router } from 'express'

class RenderRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.routes()
    }

    private routes(): void {
        this.router.get('/produtos', (req: Request, res: Response) => {
            res.render('./products/list')
        })

        this.router.get('/carrinho/:id', (req: Request, res: Response) => {
            res.render('./products/cart', {
                id: req.params.id
            })
        })
    }
}

export const renderRoutes = new RenderRoutes()