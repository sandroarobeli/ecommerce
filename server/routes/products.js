const express = require("express");

const getAllProducts = require("../controllers/products/getAllProducts");

// Initializing the router object
const router = express.Router();

// List all current products. Manages Skip & Take for pagination
router.get("/pagination/:page", getAllProducts);

module.exports = router;
