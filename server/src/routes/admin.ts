import { Router } from "express";
import {
  getAdminOrders,
  getAdminUsers,
  getDashboardMetrics,
  updateAdminOrderStatus,
} from "../controllers/adminController";
import { authenticateToken, authorizeRole } from "../middlewares";

const router = Router();

router.use(authenticateToken, authorizeRole(["ADMIN"]));

router.get("/dashboard/metrics", getDashboardMetrics);
router.get("/users", getAdminUsers);
router.get("/orders", getAdminOrders);
router.patch("/orders/:id/status", updateAdminOrderStatus);

export default router;
