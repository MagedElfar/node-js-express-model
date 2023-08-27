import { Model, DataTypes, Optional } from "sequelize";
import DatabaseConfig from "./../db";
import Product from "./product.model";

export interface ProductMediaAttributes {
    id: number;
    productId: number,
    image_url: string,
    storage_key: string,
    isMain: boolean,
    createdAt?: Date;
    updatedAt?: Date;
}

interface ProductMediaCreationAttributes extends Optional<ProductMediaAttributes, "id"> { }

class ProductMedia extends Model<ProductMediaAttributes, ProductMediaCreationAttributes> implements ProductMediaAttributes {
    public id!: number;
    public image_url!: string;
    public isMain: boolean;
    public storage_key!: string;
    public productId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProductMedia.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        storage_key: {
            type: DataTypes.STRING,
        },
        productId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        isMain: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }

    },
    {
        sequelize: DatabaseConfig.sequelize,
        tableName: "product_media",
        timestamps: true, // Enable timestamps for createdAt and updatedAt
        createdAt: "createdAt", // Customize the name of the createdAt field
        updatedAt: "updatedAt", // Customize the name of the updatedAt field
    }
);

ProductMedia.belongsTo(Product, { as: "product", foreignKey: "productId", onDelete: "CASCADE" })
Product.hasMany(ProductMedia, { as: "media", foreignKey: "productId" })


export default ProductMedia; 