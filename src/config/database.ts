import { Sequelize } from 'sequelize'
import { POSTGRES_HOST, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, POSTGRES_PORT } from '../utils/secrets'

const sequelizeConnection = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
    host: POSTGRES_HOST,
    dialect: 'postgres',
    port: parseInt(POSTGRES_PORT) || 5432,
    pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 60000
    },
    timezone: 'utc',
    logging: false
})

export default sequelizeConnection