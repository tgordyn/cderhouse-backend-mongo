import passport from "passport";
import jwt from "passport-jwt";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET_PASSPORT = process.env.SECRET_PASSPORT;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// Función para extraer el token JWT desde las cookies
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt; // Asegúrate de que el nombre de la cookie sea 'jwt'
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_PASSPORT,
      },
      async (jwt_payload, done) => {
        try {
          console.log('jwt!', jwt_payload)
          const user = await User.findById(jwt_payload.id);
          if (user) {
            return done(null, user);
          }
          return done(null, false); // No se encontró el usuario
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

  // Serialización y deserialización de usuario
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id);
    done(null, user);
  });


export default initializePassport;
