import { Router } from "express";
import { updateProductStock } from '../../controllers/productController.js';
import { isAdmin } from '../../middleware/auth.js';

const router = Router();


router.put('/update-stock/:id', isAdmin, updateProductStock);

export default router;
