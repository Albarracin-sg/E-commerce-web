import { Router } from "express";
import { login } from "../controllers/authControllerLogin";
import { register } from "../controllers/authControllerRegister";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
