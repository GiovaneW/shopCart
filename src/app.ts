import { createNamespace } from 'cls-hooked'
import compression from 'compression'
import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import { ValidationError } from 'sequelize'
import { apiRoutes } from './routes'
import { AppError, NotFoundError, WeeValidationError } from './utils/awesomeErrorsManage'
import { NODE_ENV, PORT } from './utils/secrets'
import { renderRoutes } from './views'

class App {
    public express: Application = express()

    constructor() {
        this.config()

        this.routes()

        this.errorHandling()

        this._404()
    }

    private config() {
        this.express.set('port', PORT || 3000)
        this.express.set('views', path.join(__dirname, 'views', 'pages'))
        this.express.set('view engine', 'ejs')
        this.express.use(express.static(path.join(__dirname, 'public')))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: true }))
        this.express.use(compression())

        createNamespace('session')
    }

    private routes() {
        this.express.use(function (req: Request, res: Response, next: NextFunction) {
            res.header('x-powered-by', 'gwelsis')
            next()
        })

        this.express.get('/health', (req: Request, res: Response, next: NextFunction) => {
            try {
                res.status(200).send('OK')
            } catch (error) {
                next(error)
            }
        })

        this.express.use('/api', apiRoutes.router)
        this.express.use(renderRoutes.router)
    }

    private errorHandling() {
        this.express.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err) {
                if (err instanceof NotFoundError) {
                    res.status(404).json({ message: err.message })
                } else if (err instanceof WeeValidationError) {
                    res.status(400).json({ message: err.message })
                } else if (err instanceof AppError) {
                    res.status(err.statusCode).json({ message: err.message })
                } else if (err instanceof ValidationError) {
                    res.status(400).json({ message: err.message })
                } else {
                    if (NODE_ENV === 'production')
                        res.status(500).json({ error: true, message: err.message })
                    else
                        res.status(500).json({ error: true, message: err.message, stackTrace: err.stack })
                }
            } else {
                next()
            }
        })

    }

    private _404(): void {
        this.express.use((req: Request, res: Response) => {
            res.sendStatus(404)
        })
    }

}

const app = new App()
export default app.express