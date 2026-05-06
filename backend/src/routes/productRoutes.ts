import {Router} from "express";
import * as productController from '../controllers/productController';
import {requireAuth} from "@clerk/express";

const router = Router();
//protected
router.get('/', productController.getAllProducts);

//protected
router.get("/my", requireAuth, productController.getMyProducts);

//public
router.get("/:id", productController.getProductById);

//public
router.post("/", requireAuth, productController.createProduct);

// put 
router.put("/:id", requireAuth, productController.updateProduct);

export default router;

 