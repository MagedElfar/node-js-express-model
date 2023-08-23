import { Model, DataTypes, Optional } from "sequelize";
import DatabaseConfig from "./../db";
import User from "./user.model";
import { decrypt, encrypt } from "../utility/encrypt";

export interface RefreshTokenAttributes {
    id: number;
    token: string;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<RefreshTokenAttributes, "id"> { }

class RefreshToken extends Model<RefreshTokenAttributes, ProductCreationAttributes> implements RefreshTokenAttributes {
    public id!: number;
    token: string;
    userId: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

RefreshToken.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

    },
    {
        sequelize: DatabaseConfig.sequelize,
        tableName: "refresh_token_list",
        timestamps: true, // Enable timestamps for createdAt and updatedAt
        createdAt: "createdAt", // Customize the name of the createdAt field
        updatedAt: "updatedAt", // Customize the name of the updatedAt field
    }
);

RefreshToken.beforeCreate((refreshToken) => {
    refreshToken.token = encrypt(refreshToken.token);
})

RefreshToken.afterFind((refreshToken) => {
    if (refreshToken === null) {
        return
    } else if (Array.isArray(refreshToken)) {
        refreshToken.forEach((t) => {
            t.token = decrypt(t.token);
        });
    } else {
        (refreshToken as RefreshToken).token = decrypt((refreshToken as RefreshToken).token);
    }
});

RefreshToken.belongsTo(User, { as: "user", foreignKey: "userId", onDelete: "CASCADE" })
User.hasMany(RefreshToken, { as: "tokens", foreignKey: "userId" })


export default RefreshToken; 