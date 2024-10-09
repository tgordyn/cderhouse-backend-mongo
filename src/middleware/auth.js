import passport from "passport";

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
