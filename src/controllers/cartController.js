import Cart from "../models/carts.js";
import Product from "../models/products.js";
import Ticket from "../models/tickets.js";
import { v4 as uuidv4 } from "uuid";

// Obtener el carrito del usuario
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate('products.product').lean();

    if (!cart || cart.products.length === 0) {
      return res.render('cart', { message: 'Tu carrito está vacío.' });
    }

    const cartArray = cart.products.map(item => ({
      product: item.product,
      quantity: item.quantity,
    }));

    res.render('cart', { cart: cartArray, cartId: cart._id });
  } catch (err) {
    console.error('Error obteniendo el carrito:', err);
    res.status(500).send('Error al obtener el carrito!');
  }
};

// Agregar producto al carrito
export const addProductToCart = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id;

  try {
    const product = await Product.findById(productId);

    if (!product || product.stock <= 0) {
      return res.status(400).json({ message: 'No hay suficiente stock.' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    await cart.addProduct(productId, 1);
    product.stock -= 1;
    await product.save();

    res.status(200).json({ message: 'Producto agregado al carrito' });
  } catch (err) {
    console.error('Error al agregar producto al carrito:', err);
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
};

// Eliminar producto del carrito
export const removeProductFromCart = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado.' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito.' });
    }

    const quantityToRemove = cart.products[productIndex].quantity;
    const product = await Product.findById(productId);

    product.stock += quantityToRemove;
    await product.save();

    await cart.removeProduct(productId);
    res.redirect('/api/cart');
  } catch (err) {
    console.error('Error al eliminar producto del carrito:', err);
    res.status(500).json({ message: 'Error al eliminar producto del carrito' });
  }
};

// Finalizar la compra
export const purchaseCart = async (req, res) => {
  const cartId = req.params.cid;
  const userId = req.user._id;

  try {
    const cart = await Cart.findById(cartId).populate('products.product');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    let totalAmount = 0;
    const productsToPurchase = [];

    for (let item of cart.products) {
      if (item.product.stock >= item.quantity) {
        item.product.stock -= item.quantity;
        await item.product.save();
        totalAmount += item.product.price * item.quantity;

        productsToPurchase.push({
          product: item.product._id,
          quantity: item.quantity,
        });
      }
    }

    if (productsToPurchase.length === 0) {
      return res.status(400).json({ message: 'No hay productos suficientes en stock.' });
    }

    const ticketCode = uuidv4();
    const newTicket = new Ticket({
      code: ticketCode,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: req.user.email,
      products: productsToPurchase,
    });

    await newTicket.save();
    cart.products = cart.products.filter(item => !productsToPurchase.find(p => p.product.equals(item.product._id)));
    await cart.save();

    res.redirect(`/api/ticket/${newTicket._id}`);
  } catch (err) {
    console.error('Error al finalizar la compra:', err);
    res.status(500).send('Error al finalizar la compra');
  }
};
