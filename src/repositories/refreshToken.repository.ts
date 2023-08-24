import RefreshToken, { RefreshTokenAttributes } from "../models/refreshToken.model";
import GenericRepository from "./genericRepository";

export default class RefreshTokenRepository extends GenericRepository<RefreshToken, RefreshTokenAttributes> {

    constructor() {
        super(RefreshToken)
    }

}