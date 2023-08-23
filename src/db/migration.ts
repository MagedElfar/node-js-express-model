import DataBase from "./index"
import Product from "../models/product.model";
import User from "../models/user.model";
import { ModelStatic, QueryInterface } from "sequelize";
import DatabaseConfig from "./../db"
import RefreshToken from "../models/refreshToken.model";

// Get the existing indexes for the model from the database
async function getExistingIndexes(queryInterface: QueryInterface, tableName: string): Promise<any> {
    const indexes = await queryInterface.showIndex(tableName)

    // console.log(tableName, " = ", indexes)

    return indexes

}

// Remove non-primary indexes from the database
async function removeIndexes(queryInterface: QueryInterface, tableName: string) {

    const tableExists = await queryInterface.showAllTables().then(tables => tables.includes(tableName));

    if (!tableExists) {
        console.log(`Table ${tableName} does not exist.`);
        return;
    }


    const indexes = await getExistingIndexes(queryInterface, tableName);

    await Promise.all(indexes.map(
        async (index: any) => {
            if (!index.primary && index.unique) {
                await queryInterface.removeIndex(tableName, index.name)
            }
        }
    ))
}


async function migration(models: ModelStatic<any>[]) {
    try {
        // Call the sync method on each model's prototype

        await DataBase.testConnection()
        const queryInterface = DatabaseConfig.sequelize.getQueryInterface();

        await Promise.all(models.map(async (model) => {
            const table = model.tableName;
            try {

                await removeIndexes(queryInterface, table)
                await model.sync({ alter: true });
                console.log(`${table} table created successfully!`)
            } catch (error) {
                console.error(`Error creating table : ${table} with error : ${error}`);
            }

        }))

        console.log("All table created successfully!")

    } catch (error) {
        console.error(error);
    }
}

migration([
    User,
    Product,
    RefreshToken
])