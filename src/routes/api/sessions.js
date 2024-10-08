import express from "express";
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    const newUser = new User({ first_name, last_name, email, age, password });
    console.log("usuario", newUser);
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    const token = jwt.sign({ id: user._id }, "coder_jwt", { expiresIn: "1h" });
    req.session.user = user;
    // Guardar el token en una cookie
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/api/sessions/current");
  } catch (err) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// Ruta "current" para validar al usuario logueado
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user) {
      res.render("profile", {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
      });
    } else {
      res.status(401).json({ error: 'No se ha autenticado correctamente' });
    }
  }
);

// Ruta para terminar sesion
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error al cerrar sesión");
    res.redirect("/login");
  });
});

// Ruta reestablecer contraseña
router.get("/restore", (req, res) => {
  res.render("restore");
});



export default router;
