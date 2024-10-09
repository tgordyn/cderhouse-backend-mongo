import { Router } from "express";
import UserRepository from "../../repositories/users.repository.js";
import UserDTO from "../../dao/DTOs/user.dto.js";
import { passportCall } from "../../utils/passportUtils.js";

const router = Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    await UserRepository.createUser({
      first_name,
      last_name,
      email,
      age,
      password,
    });
    res.redirect("/login");
  } catch (err) {
    console.error("Error al registrar el usuario:", err);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

// Inicio de sesión
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_PASSPORT = process.env.SECRET_PASSPORT;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDTO = await UserRepository.validateUser(email, password);
    if (!userDTO) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    // Genera el token JWT usando el id del DTO

    const token = jwt.sign({ id: userDTO._id }, SECRET_PASSPORT);
    res.cookie("jwt", token, { httpOnly: true });
    //res.redirect("/api/sessions/current");
    res.render("login");
    const decoded = jwt.verify(token, SECRET_PASSPORT);
  } catch (err) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// Ruta "current" para validar al usuario logueado
router.get("/current", passportCall("jwt"), async (req, res) => {
  try {
    if (req.user) {
      const userDTO = new UserDTO(req.user);
      res.render("profile", userDTO);
    } else {
      res.status(401).json({ error: "No se ha autenticado correctamente" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error al obtener información del usuario" });
  }
});

// Ruta para terminar sesión
router.post("/logout", async (req, res) => {
  console.log("chau");
  try {
    res.clearCookie("jwt");
    res.redirect("/login");
  } catch (err) {
    res.status(500).send("Error al cerrar sesión");
  }
});

// Ruta reestablecer contraseña
router.get("/restore", (req, res) => {
  res.render("restore");
});

export default router;
