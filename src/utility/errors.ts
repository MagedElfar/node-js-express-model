

// const formatDbError = (err: any) => {
//     if (err.message) console.warn(err.message);
//     else console.warn(err.sqlMessage);
//     return {
//         code: 500,
//         message: "Database failure",
//     };
// }

// export const requestErrorFormat = (err: Error) => {
//     const error = Object.assign({}, { type: "error" },
//         err.errors && err.message ? {
//             message: err.response?.data.message || err.message,
//             errors: err.response?.data.message || err.errors
//         } :
//             err.errors ? {
//                 errors: err.response?.data.message || err.errors
//             } : {
//                 message: err.response?.data.message || err.message
//             }
//     );

//     return error;
// }

export const setError = (status: number, message: string | string[]): object => {
    return { status, message };
}


// export { formatDbError, requestErrorFormat, setError }

export class AppError extends Error {
    status: number;
    error: string | string[];
    type: string;
    constructor(message: string, status: number, error: string | string[]) {
        super(message);
        this.name = this.constructor.name;
        this.type = "Error";
        this.status = status;
        this.error = error
    }
}


export class BadRequestError extends AppError {
    constructor(error: string | string[]) {
        super("BadRequestError", 400, error)
    }
}

export class AuthorizationError extends AppError {
    constructor(error: string | string[]) {
        super("AuthorizationError", 401, error)
    }
}

export class ForbiddenError extends AppError {
    constructor(error: string | string[]) {
        super("ForbiddenError", 403, error)
    }
}

export class NotFoundError extends AppError {
    constructor(error: string | string[]) {
        super("NotFoundError", 404, error)
    }
}

export class InternalServerError extends AppError {
    constructor(error: string | string[]) {
        super("InternalServerError", 500, error)
    }
}