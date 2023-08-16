import { Attributes, DestroyOptions, FindOptions, Model, ModelStatic, WhereAttributeHashValue, WhereOptions } from "sequelize";
import { MakeNullishOptional } from "sequelize/types/utils";

export default abstract class GenericRepository<T extends Model> {

    protected model: ModelStatic<T>

    constructor(model: ModelStatic<T>) {
        this.model = model

    }

    public create(data: MakeNullishOptional<T["_creationAttributes"]>): Promise<T> {
        return this.model.create(data)
    }

    public findById(id: number): Promise<T | null> {
        return this.model.findByPk(id)
    }

    public findOne(data: WhereOptions<Attributes<T>>): Promise<T | null> {
        return this.model.findOne({
            where: data
        })
    }

    public delete(option: WhereAttributeHashValue<Attributes<T>[string]>): Promise<number> {
        return this.model.destroy({
            where: option
        })
    }
}