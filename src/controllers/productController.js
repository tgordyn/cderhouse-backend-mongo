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
  let userRole = null;

  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_PASSPORT);
      if (decoded) {
        isLoggedIn = true;
        userRole = decoded.role;
        console.log('decoded', decoded)
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

    res.render('productDetail', { product, isLoggedIn, userRole });
  } catch (err) {
    console.error('Error buscando el producto:', err);
    res.status(500).send('Error al buscar el producto');
  }
};



//  admin actualice el stock
export const updateProductStock = async (req, res) => {
  try {
    const productId = req.params.id; // Obtiene el ID del producto desde los parámetros de la URL
    const { stockToAdd } = req.body; // Obtiene la cantidad de stock a agregar desde el cuerpo de la petición

    // Verificar que el stock a agregar sea un número
    if (!stockToAdd || isNaN(stockToAdd)) {
      return res.status(400).send({ message: 'Cantidad de stock inválida' });
    }

    // Buscar el producto por su ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send({ message: 'Producto no encontrado' });
    }

    // Actualizar el stock del producto
    product.stock += parseInt(stockToAdd, 10); // Agregar la cantidad ingresada al stock actual
    await product.save(); // Guardar el producto con el nuevo stock

    res.status(200).send({ message: 'Stock actualizado correctamente', product });
  } catch (error) {
    console.error('Error actualizando el stock:', error);
    res.status(500).send({ message: 'Error actualizando el stock del producto' });
  }
};
