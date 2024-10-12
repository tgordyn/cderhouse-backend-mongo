import Product from "../models/products.js";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_PASSPORT = process.env.SECRET_PASSPORT;

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const productsArray = products.map(product => product.toObject());
    res.render('index', { products: productsArray });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error obteniendo productos');
  }
};


export const getProductById = async (req, res) => {
  let isLoggedIn = false;

  // Verificar si hay una cookie con el token
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_PASSPORT);
      if (decoded) {
        isLoggedIn = true;
      }
    } catch (error) {
      console.error("Error verificando el token JWT:", error);
    }
  }

  try {
    const productId = req.params.id;


    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("ID de producto no válido");
    }

    const product = await Product.findById(productId).lean();


    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }


    res.render('productDetail', { product, isLoggedIn });
  } catch (err) {
    console.error('Error buscando el producto:', err);
    res.status(500).send('Error al buscar el producto');
  }
};
