import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import User, { UserAttributes } from "../models/user.model";
import UserRepository from "../repositories/user.repository";
import { setError } from "../utility/error-format";

export interface IUserServices {
    createUser(createUserDto: CreateUserDto): Promise<UserAttributes>;
    findUserById(id: number): Promise<UserAttributes | null>;
    findOne(data: Partial<UserAttributes>): Promise<UserAttributes | null>;
    updateOne(id: number, updateUserDto: UpdateUserDto): Promise<UserAttributes | null>;
    deleteUser(id: number): Promise<void>;
}

export default class UserServices implements IUserServices {

    private readonly userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserAttributes> {
        try {
            const user = await this.userRepository.create(createUserDto)

            return user.dataValues
        } catch (error) {
            throw error
        }
    }

    async findUserById(id: number): Promise<UserAttributes | null> {
        try {
            const user = await this.userRepository.findById(id)

            if (!user) return null;

            return user.dataValues

        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<UserAttributes>): Promise<UserAttributes | null> {
        try {

            const user = await this.userRepository.findOne(data)

            if (!user) return null;

            return user.dataValues

        } catch (error) {
            throw error
        }
    }

    async updateOne(id: number, updateUserDto: UpdateUserDto) {
        try {
            return await this.userRepository.update(id, updateUserDto)
        } catch (error) {
            throw error
        }
    }

    async deleteUser(id: number): Promise<void> {
        try {
            const isDeleted = await this.userRepository.delete({ id })

            if (isDeleted === 0) throw setError(400, "user not deleted")

            return;
        } catch (error) {
            throw error
        }
    }

}