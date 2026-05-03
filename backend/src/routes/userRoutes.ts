import {Router} from "express";
import {syncUser} from "../controllers/userController";
import {requireAuth} from "@clerk/express";

const router = Router();

// /api/userssync - post => sync the clerk user to DB

router.post("/sync", requireAuth(), syncUser);

export default router;