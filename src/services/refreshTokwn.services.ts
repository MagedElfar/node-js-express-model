import { RefreshTokenAttributes } from './../models/refreshToken.model';
import { NotFoundError } from "../utility/errors";
import { CreateRefreshTokenDto } from '../dto/refreshToken.dto';
import RefreshTokenRepository from '../repositories/refreshToken.repository';
import JwtServices from './jwt.services';

export interface IRefreshTokenServices {
    createToken(createRefreshTokenDto: CreateRefreshTokenDto): Promise<RefreshTokenAttributes>;
    findOne(data: Partial<RefreshTokenAttributes>): Promise<RefreshTokenAttributes | null>;
    deleteOne(id: number): Promise<void>;
}

export default class RefreshTokenServices implements IRefreshTokenServices {

    private readonly refreshTokenRepository: RefreshTokenRepository;
    private readonly jwtServices: JwtServices

    constructor(
        refreshTokenRepository: RefreshTokenRepository,
        jwtServices: JwtServices
    ) {
        this.refreshTokenRepository = refreshTokenRepository
        this.jwtServices = jwtServices
    }

    async createToken(createRefreshTokenDto: CreateRefreshTokenDto): Promise<RefreshTokenAttributes> {
        try {

            const token = this.jwtServices.createToken({ id: createRefreshTokenDto.userId }, "4d")

            const refreshToken = await this.refreshTokenRepository.create({
                userId: createRefreshTokenDto.userId,
                token
            })

            return refreshToken
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<RefreshTokenAttributes>): Promise<RefreshTokenAttributes | null> {
        try {

            const refreshToken = await this.refreshTokenRepository.findOne(data)

            if (!refreshToken) return null;

            return refreshToken

        } catch (error) {
            throw error
        }
    }


    async deleteOne(id: number): Promise<void> {
        try {
            const isDeleted = await this.refreshTokenRepository.delete({ id })

            if (isDeleted === 0) throw new NotFoundError("record not exist")

            return;
        } catch (error) {
            throw error
        }
    }

}