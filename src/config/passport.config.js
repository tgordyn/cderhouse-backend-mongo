import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';


const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies.token
  ]),
  secretOrKey: 'coder_jwt'
};


passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);


export default passport;
