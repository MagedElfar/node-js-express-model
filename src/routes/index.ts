import { Router } from "express"
import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"
import productRoutes from "./product.routes"

import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoutes)
router.use("/users", authMiddleware.authenticate, userRoutes)
router.use("/products", authMiddleware.authenticate, productRoutes)

export default router;