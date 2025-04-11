import express from "express"
import passport from "passport"
import {registerUser, loginUser,getAllUsers} from "../../controllers/Users/authController.js";

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/getAllUser', getAllUsers)

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard')
);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard')
);

export default router;