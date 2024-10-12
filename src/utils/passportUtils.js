import passport from "passport";

export const passportCall = (strategy) => {
  return (req, res, next) => {
    console.log('Verificando autenticación con Passport...');
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        console.log('No se encontró el usuario:', info);
        return res.status(401).send({ error: "No autorizado" });
      }
      req.user = user;
      console.log('Usuario autenticado:', user);
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).send({ error: "Unauthorized" });
    if (req.user.role !== role)
      return res.status(403).send({ error: "No permission" });
    next();
  };
};
