const express = require("express");
const { check } = require("express-validator");

const credentialLogin = require("../controllers/users/credentialLogin");
const googleLogin = require("../controllers/users/googleLogin");

// Initializing the router object
const router = express.Router();

// Login a User with credentials (email, password)
router.post(
  "/credential-login",
  [
    check("email").not().isEmpty().isEmail().trim().escape(),
    check("password").not().isEmpty().trim().escape(),
  ],
  credentialLogin
);

// Login a User with Google Login
router.post("/google-login", googleLogin);

module.exports = router;
