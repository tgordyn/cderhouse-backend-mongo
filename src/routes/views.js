import { Router } from "express";
import { ensureAuthenticated } from "../middleware/auth.js";
import { getAllProducts, getProductById } from "../controllers/productController.js";


const router = Router();

router.get('/', getAllProducts);
router.get("/login", ensureAuthenticated, (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.get('/products/:id', getProductById);


export default router;
