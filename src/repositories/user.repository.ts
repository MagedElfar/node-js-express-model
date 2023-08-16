import User from "../models/user.model";
import GenericRepository from "./genericRepository";

export default class UserRepository extends GenericRepository<User> {

    constructor() {
        super(User)
    }

}