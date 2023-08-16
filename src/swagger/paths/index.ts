import { Paths } from "swagger-jsdoc"
import authPath from "./auth.path"
import userPath from "./user.path"
import productPath from "./product.path"

const paths: Paths = {
    ...authPath,
    ...userPath,
    ...productPath
}

export default paths