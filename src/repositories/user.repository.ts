import User from "../models/user.model";
import GenericRepository from "./genericRepository";

export default class UserRepository extends GenericRepository<User, UserAttributes> {

    constructor() {
        super(User)
    }

}