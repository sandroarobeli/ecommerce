const express = require("express");
const { check } = require("express-validator");

const checkAuthorization = require("../utils/checkAuthorization");
const credentialLogin = require("../controllers/users/credentialLogin");
const googleLogin = require("../controllers/users/googleLogin");
const credentialRegister = require("../controllers/users/credentialRegister");
const googleRegister = require("../controllers/users/googleRegister");
const updateProfile = require("../controllers/users/updateProfile");
const deleteAccount = require("../controllers/users/deleteAccount");

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

// Update User profile. Privileged, requires authorization
router.patch(
  "/update-profile",
  [
    check("name").not().isEmpty().trim().escape(),
    check("email").not().isEmpty().isEmail().trim().escape(),
    check("password").not().isEmpty().trim().escape(),
  ],
  checkAuthorization,
  updateProfile
);

// Delete User account
router.delete(
  "/delete-account/:userId",
  [check("email").not().isEmpty().isEmail().trim().escape()],
  checkAuthorization,
  deleteAccount
);

module.exports = router;
