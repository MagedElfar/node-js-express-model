
declare global {
    type UserAttributes = import("../models/user.model").UserAttributes
    namespace Express {
        interface User extends UserAttributes { }
        interface Request {
            refreshToken?: string,
            user?: UserAttributes
        }
    }
}

export { }