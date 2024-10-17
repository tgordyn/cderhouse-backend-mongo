import passport from "passport";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const SECRET_PASSPORT = process.env.SECRET_PASSPORT;

export const isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect('/login');
    }
    req.user = user; // Guarda el usuario autenticado en el objeto req
    next();
  })(req, res, next);
};

export const isNotAuthenticated = (req, res, next) => {
  if (!req.cookies.jwt) { // Verifica si no hay token en las cookies
    return next();
  } else {
    return res.redirect('/api/sessions/current'); // Redirige si hay token
  }
};

export const ensureAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) {
      return res.redirect('/api/sessions/current');
    }

    next();
  })(req, res, next);
}

export const isAdmin = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(403).send({ message: 'Acceso denegado. No hay token proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_PASSPORT);
    if (decoded && decoded.role === 'admin') {
      next();
    } else {
      res.status(403).send({ message: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
    }
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(403).send({ message: 'Acceso denegado. Token inválido.' });
  }
};
