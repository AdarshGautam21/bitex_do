const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Admin = mongoose.model("admins");
const keys = require("../config/key");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      let user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        console.log('Unauthorized');
      }
      let admin = await Admin.findById(jwt_payload.id);
      if (admin) {
        return done(null, admin);
      } else {
        console.log('Unauthorized');
      }

      if (!user && !admin) {
        return done(null, 'Unauthorized');
      }
    })
  );
};
