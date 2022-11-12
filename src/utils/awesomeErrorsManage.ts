export class NotFoundError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class WeeValidationError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class AppError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message)
    }
}