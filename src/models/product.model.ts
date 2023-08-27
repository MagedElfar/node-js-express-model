import { Model, DataTypes, Optional } from "sequelize";
import DatabaseConfig from "./../db";
import User from "./user.model";
import { ProductMediaAttributes } from "./productMedia.model";

export interface ProductAttributes {
    id: number;
    name: string;
    description: string;
    userId: number;
    user?: UserAttributes;
    media?: ProductAttributes[];
    createdAt?: Date;
    updatedAt?: Date;

}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> { }

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public description!: string;
    public name!: string;
    public userId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Product.init(
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
        description: {
            type: DataTypes.STRING,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

    },
    {
        sequelize: DatabaseConfig.sequelize,
        tableName: "products",
        timestamps: true, // Enable timestamps for createdAt and updatedAt
        createdAt: "createdAt", // Customize the name of the createdAt field
        updatedAt: "updatedAt", // Customize the name of the updatedAt field
    }
);

Product.belongsTo(User, { as: "user", foreignKey: "userId", onDelete: "CASCADE" })
User.hasMany(Product, { as: "products", foreignKey: "userId" })


export default Product; 