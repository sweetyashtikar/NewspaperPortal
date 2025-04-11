// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import User from "../model/User.js"

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id).then(user => done(null, user));
// });

// // Google Strategy
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "/auth/google/callback"
// }, async (accessToken, refreshToken, profile, done) => {
//   const existingUser = await User.findOne({ googleId: profile.id });
//   if (existingUser) return done(null, existingUser);

//   const newUser = new User({
//     googleId: profile.id,
//     name: profile.displayName,
//     provider: 'google'
//   });
//   await newUser.save();
//   done(null, newUser);
// }));

// // Facebook Strategy
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID,
//   clientSecret: process.env.FACEBOOK_APP_SECRET,
//   callbackURL: "/auth/facebook/callback",
//   profileFields: ['id', 'displayName', 'email']
// }, async (accessToken, refreshToken, profile, done) => {
//   const existingUser = await User.findOne({ facebookId: profile.id });
//   if (existingUser) return done(null, existingUser);

//   const newUser = new User({
//     facebookId: profile.id,
//     name: profile.displayName,
//     provider: 'facebook'
//   });
//   await newUser.save();
//   done(null, newUser);
// }));
