import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.js";
import { getUserCart, addProductToCart, removeProductFromCart, purchaseCart } from "../../controllers/cartController.js";

const router = Router();

// Obtener el carrito del usuario
router.get('/', isAuthenticated, getUserCart);

// Agregar producto al carrito
router.post('/add/:id', isAuthenticated, addProductToCart);

// Eliminar producto del carrito
router.post('/remove/:id', isAuthenticated, removeProductFromCart);

// Finalizar la compra
router.post('/:cid/purchase', isAuthenticated, purchaseCart);

export default router;
