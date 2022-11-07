import { Request, Response, Router } from 'express'
import * as fs from 'fs'

class RenderRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.routes()
    }

    private routes(): void {
        this.router.get('/teste', (req: Request, res: Response) => {
            try {
                console.log('teste')
                // const mycss = fs.readFileSync('../styles/styles.css', 'utf8')
                res.render('teste')
            } catch (error) {
                console.log(error)
                
            }
        })
    }
}

export const renderRoutes = new RenderRoutes()