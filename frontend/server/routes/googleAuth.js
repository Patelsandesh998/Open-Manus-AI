import express from "express";
import passport from "passport";

const router = express.Router();

// Step 1: Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google-failed`,
    session: true,
  }),
  (req, res) => {
    // Redirect back to frontend after successful login
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

export default router;
