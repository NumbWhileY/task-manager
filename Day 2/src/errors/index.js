const AppError = require("./AppError")

class NotFoundError extends AppError {
    constructor(message = 'Не найдено') {
        super(message, 404);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Ошибка валидации') {
        super(message, 400);
    }
}


class UnauthorizedError extends AppError {
    constructor(message = 'Требуется авторизация') {
        super(message, 401);
    }
}


class ConflictError extends AppError {
    constructor(message = 'Конфликт') {
        super(message, 409);
    }
}

module.exports = { AppError, NotFoundError, ValidationError, UnauthorizedError, ConflictError };