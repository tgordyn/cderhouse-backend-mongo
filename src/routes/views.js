import { Router } from "express";
import { isNotAuthenticated } from "../middleware/auth.js";
import Product from "../models/products.js";
import mongoose from "mongoose";

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

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/restore", (req, res) => {
  res.render("restore", { user: req.session.user });
});

import jwt from "jsonwebtoken"; // Asegúrate de tener este paquete instalado
import dotenv from "dotenv";

dotenv.config();
const SECRET_PASSPORT = process.env.SECRET_PASSPORT;

router.get("/products/:id", async (req, res) => {
  let isLoggedIn = false;

  // Verificar si hay una cookie con el token
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_PASSPORT); // Decodificar el token
      if (decoded) {
        isLoggedIn = true; // El usuario está autenticado si el token es válido
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

    res.render("productDetail", { product, isLoggedIn });
  } catch (err) {
    console.error("Error buscando el producto:", err);
    res.status(500).send("Error al buscar el producto");
  }
});

export default router;
