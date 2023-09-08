import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { UserAttributes } from "../models/user.model";
import UserRepository from "../repositories/user.repository";
import { BadRequestError, NotFoundError } from "../utility/errors";

export interface IUserServices {
    createUser(createUserDto: CreateUserDto): Promise<UserAttributes>;
    findUserById(id: number): Promise<UserAttributes | null>;
    findOne(data: Partial<UserAttributes>): Promise<UserAttributes | null>;
    updateOne(id: number, updateUserDto: UpdateUserDto): Promise<UserAttributes | null>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserAttributes | null>
    deleteUser(id: number): Promise<number>;
}

export default class UserServices implements IUserServices {

    private readonly userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserAttributes> {
        try {
            const user = await this.userRepository.create(createUserDto)

            return user
        } catch (error) {
            throw error
        }
    }

    async findUserById(id: number): Promise<UserAttributes | null> {
        try {
            const user = await this.userRepository.findById(id)

            if (!user) return null;

            return user

        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<UserAttributes>): Promise<UserAttributes | null> {
        try {

            const user = await this.userRepository.findOne(data)

            if (!user) return null;

            return user

        } catch (error) {
            throw error
        }
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        try {
            const user = await this.findUserById(id);

            if (!user) throw new NotFoundError("user not exist")

            const userEmail = await this.findOne({ email: updateUserDto.email })

            if (userEmail && (userEmail.id !== id)) throw new BadRequestError("email is already exist")

            return await this.updateOne(id, updateUserDto)
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

    async deleteUser(id: number): Promise<number> {
        try {
            const isDeleted = await this.userRepository.delete({ id })

            return isDeleted;
        } catch (error) {
            throw error
        }
    }

}