const express = require("express");
const { check } = require("express-validator");

const credentialLogin = require("../controllers/users/credentialLogin");
const googleLogin = require("../controllers/users/googleLogin");
const credentialRegister = require("../controllers/users/credentialRegister");
const googleRegister = require("../controllers/users/googleRegister");

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

// Login a User with Google
router.post("/google-login", googleLogin);

// Register a User with credentials (name, email, password)
router.post(
  "/credential-register",
  [
    check("name").not().isEmpty().trim().escape(),
    check("email").not().isEmpty().isEmail().trim().escape(),
    check("password").not().isEmpty().trim().escape(),
  ],
  credentialRegister
);

// Register a User with Google
router.post("/google-register", googleRegister);

module.exports = router;
