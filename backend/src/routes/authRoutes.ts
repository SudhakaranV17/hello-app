import { Router } from "express";
import { authCallback, getMe } from "../controllers/authController";
import { protectedRoute } from "../middleware/auth";

const router = Router();

router.get("/getMe", protectedRoute, getMe);
router.post("/callback", authCallback);
export default router;
