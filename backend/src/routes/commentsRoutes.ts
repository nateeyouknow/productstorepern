import {Router} from "express";
import {requireAuth} from "@clerk/express";
import * as commentController from "../controllers/commentController";

const router = Router();
// post to /api/comments/:productId  - Add comment to product (it is protected)
router.post("/:productId", requireAuth, commentController.createComment);

// delete /api/comments/:commentId - delete comment (it is protected -otwner only)
router.delete("/:commentId", requireAuth, commentController.deleteComment);


export default router;