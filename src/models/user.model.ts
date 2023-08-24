// src/models/User.ts
import { Model, DataTypes, Optional } from "sequelize";
import DatabaseConfig from "./../db";

export enum Role {
    ADMIN = "admin",
    CUSTOMER = "customer"
}

export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role?: Role;
    createdAt?: Date;
    updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public password: string;
    public id!: number;
    public name!: string;
    public email!: string;
    public role: Role;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM(...Object.values(Role)),
            defaultValue: Role.CUSTOMER,
            allowNull: false
        }

    },
    {
        sequelize: DatabaseConfig.sequelize,
        tableName: "users",
        timestamps: true, // Enable timestamps for createdAt and updatedAt
        createdAt: "createdAt", // Customize the name of the createdAt field
        updatedAt: "updatedAt", // Customize the name of the updatedAt field
    }
);


export default User;
