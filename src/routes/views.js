import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middleware/auth.js";
import Product from "../models/products.js";
import Cart from "../models/carts.js";
import Ticket from "../models/tickets.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Trae todos los productos

    // Convertir cada producto a un objeto plano
    const productsArray = products.map((product) => product.toObject());

    res.render("index", { products: productsArray });
  } catch (err) {
    console.error("Error obteniendo productos:", err);
    res.status(500).send("Error al obtener productos");
  }
});

router.get("/login", (req, res) => {
  // Si el usuario ya está logueado, redirigir a la ruta actual
  if (req.session.user) {
    return res.redirect("/api/sessions/current"); // Redirige si está logueado
  }

  // Si no está logueado, renderiza la vista de login
  res.render("login");
});

router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register");
});

router.get("/profile", isNotAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user });
});

router.get("/restore", (req, res) => {
  res.render("restore", { user: req.session.user });
});

router.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Verificar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("ID de producto no válido");
    }

    // Buscar el producto por ID sin necesidad de convertirlo a ObjectId manualmente
    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    //console.log('producto', product)
    res.render("productDetail", { product });
  } catch (err) {
    console.error("Error buscando el producto:", err);
    res.status(500).send("Error al buscar el producto");
  }
});

// Ruta para obtener el carrito
// router.get('/cart', isAuthenticated, async (req, res) => {
//   try {

//     const userId = req.session.user._id; // Asegúrate de que el usuario esté autenticado

//     // Buscar el carrito del usuario y poblar los productos
//     const cart = await Cart.findOne({ userId }).populate('products.product'); // Solo usa 'product' para el populate

//     if (!cart || cart.products.length === 0) {
//       return res.render('cart', { message: 'Tu carrito está vacío.' });
//     }

//     // Convierte los productos en objetos simples
//     const cartArray = cart.products.map(item => ({
//       product: item.product.toObject(), // Convierte el producto a un objeto simple
//       quantity: item.quantity // Mantén la cantidad
//     }));

//     // Renderiza la vista del carrito con el array de productos
//     res.render('cart', { cart: cartArray, cartId: cart._id  });
//   } catch (err) {
//     console.error('Error obteniendo el carrito:', err);
//     res.status(500).send('Error al obtener el carrito!');
//   }
// });

// // Ruta para agregar un producto al carrito
// router.post('/cart/add/:id', async (req, res) => {
//   const productId = req.params.id;
//   const userId = req.session.user._id; // Asegúrate de que el usuario esté autenticado

//   try {
//     // Encuentra el producto en la base de datos
//     const product = await Product.findById(productId);

//     // Verifica si hay suficiente stock
//     if (!product || product.stock <= 0) {
//       return res.status(400).json({ message: 'No hay suficiente stock para agregar este producto al carrito.' });
//     }

//     // Encuentra el carrito del usuario o crea uno nuevo
//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       cart = new Cart({ userId, products: [] });
//     }

//     // Agrega el producto al carrito
//     await cart.addProduct(productId, 1);

//     // Descontar el stock
//     product.stock -= 1; // Descontar una unidad
//     await product.save(); // Guardar los cambios en el producto

//     return res.status(200).json({ message: 'Producto agregado al carrito' });
//   } catch (err) {
//     console.error('Error al agregar producto al carrito:', err);
//     return res.status(500).json({ message: 'Error al agregar producto al carrito' });
//   }
// });

// // Ruta para eliminar un producto del carrito
// router.post('/cart/remove/:id', async (req, res) => {
//   const productId = req.params.id; // ID del producto a eliminar
//   const userId = req.session.user._id; // Asegúrate de que el usuario esté autenticado

//   try {
//     // Encuentra el carrito del usuario
//     const cart = await Cart.findOne({ userId });

//     if (!cart) {
//       return res.status(404).json({ message: 'Carrito no encontrado.' });
//     }

//     // Encuentra el producto en el carrito
//     const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

//     if (productIndex === -1) {
//       return res.status(404).json({ message: 'Producto no encontrado en el carrito.' });
//     }

//     // Obtén la cantidad del producto que se va a eliminar
//     const quantityToRemove = cart.products[productIndex].quantity;

//     // Encuentra el producto en la base de datos
//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: 'Producto no encontrado.' });
//     }

//     // Sumar la cantidad al stock
//     product.stock += quantityToRemove; // Sumar la cantidad eliminada
//     await product.save(); // Guardar los cambios en el producto

//     // Llama al método para eliminar el producto
//     await cart.removeProduct(productId);

//     // Redirigir de nuevo a la página del carrito
//     return res.redirect('/cart');
//   } catch (err) {
//     console.error('Error al eliminar producto del carrito:', err);
//     return res.status(500).json({ message: 'Error al eliminar producto del carrito' });
//   }
// });

// router.post('/cart/:cid/purchase', isAuthenticated, async (req, res) => {
//   const cartId = req.params.cid;
//   const userId = req.session.user._id;

//   try {
//     // Encuentra el carrito del usuario y sus productos
//     const cart = await Cart.findById(cartId).populate('products.product');
//     if (!cart || cart.products.length === 0) {
//       return res.status(400).json({ message: 'El carrito está vacío o no existe.' });
//     }

//     let totalAmount = 0;
//     const productsToPurchase = [];

//     // Recorre los productos del carrito y verifica el stock
//     for (let item of cart.products) {
//       if (item.product.stock >= item.quantity) {
//         // Si hay stock suficiente, restar la cantidad al stock del producto
//         item.product.stock -= item.quantity;
//         await item.product.save();
//         totalAmount += item.product.price * item.quantity;
//         productsToPurchase.push(item); // Añadir el producto al proceso de compra
//       }
//     }

//     if (productsToPurchase.length === 0) {
//       return res.status(400).json({ message: 'No hay productos suficientes en stock para finalizar la compra.' });
//     }

//     // Generar un código único para el ticket
//     const ticketCode = uuidv4();

//     // Crear el ticket
//     const newTicket = new Ticket({
//       code: ticketCode, // El código generado
//       purchase_datetime: new Date(),
//       amount: totalAmount,
//       purchaser: req.session.user.email
//     });

//     await newTicket.save(); // Guardar el ticket en la base de datos

//     // Limpiar el carrito o eliminar los productos comprados
//     cart.products = cart.products.filter(item => !productsToPurchase.includes(item));
//     await cart.save();

//     // Redirigir a una página de confirmación de compra o mostrar el detalle del ticket
//     res.redirect(`/api/ticket/${newTicket._id}`);
//   } catch (err) {
//     console.error('Error al finalizar la compra:', err);
//     res.status(500).send('Error al finalizar la compra');
//   }
// });

// router.get('/ticket/:ticketId', isAuthenticated, async (req, res) => {
//   try {
//     const ticket = await Ticket.findById(req.params.ticketId);

//     if (!ticket) {
//       return res.status(404).json({ message: 'Ticket no encontrado.' });
//     }
//     const ticketObject = ticket.toObject();

//     res.render('ticketDetail', { ticket: ticketObject });
//   } catch (err) {
//     console.error('Error al obtener el ticket:', err);
//     res.status(500).send('Error al obtener el ticket');
//   }
// });

export default router;
