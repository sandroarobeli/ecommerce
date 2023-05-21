const express = require("express");

const getAllProducts = require("../controllers/products/getAllProducts");
const getProductBySlug = require("../controllers/products/getProductBySlug");

// Initializing the router object
const router = express.Router();

// List all current products. Manages Skip & Take for pagination
router.get("/pagination/:page", getAllProducts);

// Retrieve product by its slug including comments if any
router.get("/product/:slug", getProductBySlug);

module.exports = router;
