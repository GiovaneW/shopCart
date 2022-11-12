import app from './app'
import sequelizeConnection from './config/database'
import { NODE_ENV } from './utils/secrets'

class Server {

    private initDatabase(): void {
        sequelizeConnection.authenticate().then(() => {
            console.log('Database connected succesfull.')
        }).catch((error) => {
            console.log('Unable to connect to database')
            console.log(error)
        })
    }
    start(): void {
        app.listen(app.get('port'), () => {
            console.log(`ShopCart is running on port: ${app.get('port')} in mode ${NODE_ENV}`)
        })
        
        this.initDatabase()
    }
}

const server = new Server()
server.start()