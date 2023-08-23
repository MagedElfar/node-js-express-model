import RefreshToken from "../models/refreshToken.model";
import GenericRepository from "./genericRepository";

export default class RefreshTokenRepository extends GenericRepository<RefreshToken> {

    constructor() {
        super(RefreshToken)
    }

}