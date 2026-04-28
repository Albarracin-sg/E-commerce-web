import { Router } from "express";
import { createOrder, getOrders } from "../controllers/orderController";
import { authenticateToken } from "../middlewares";

const router = Router();

router.use(authenticateToken);

router.post("/", createOrder);
router.get("/", getOrders);

export default router;
