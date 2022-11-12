if (process.env['NODE_ENV'] != 'production') {
    require('dotenv').config()
}

if (!process.env.NODE_ENV || !process.env.PORT) {
    console.log('Falta configuração básica de projeto')
    process.exit(1)
}

if (!process.env.POSTGRES_DB || !process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD || !process.env.POSTGRES_HOST || !process.env.POSTGRES_PORT) {
    console.log('Falta configuraçào de banco!')
    process.exit(1)
}

export const NODE_ENV = process.env['NODE_ENV'],
    PORT = process.env['PORT'],
    POSTGRES_DB = process.env['POSTGRES_DB'],
    POSTGRES_USER = process.env['POSTGRES_USER'],
    POSTGRES_PASSWORD = process.env['POSTGRES_PASSWORD'],
    POSTGRES_HOST = process.env['POSTGRES_HOST'],
    POSTGRES_PORT = process.env['POSTGRES_PORT']