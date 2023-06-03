const express = require("express");
const { check } = require("express-validator");

const checkAuthorization = require("../utils/checkAuthorization");
const getAllProducts = require("../controllers/products/getAllProducts");
const getProductBySlug = require("../controllers/products/getProductBySlug");
const postReview = require("../controllers/products/postReview");
const updateProductInventory = require("../controllers/products/updateProductInventory");

// Initializing the router object
const router = express.Router();

// List all current products. Manages Skip & Take for pagination
router.get("/pagination/:page", getAllProducts);

// Retrieve product by its slug including comments if any
router.get("/product/:slug", getProductBySlug);

// Update available product inventory quantities
router.patch("/update-inventory", updateProductInventory);

// Adds review and rating to a specific product. Privileged, requires authorization
router.post(
  "/reviews/:productId",
  [check("content").not().isEmpty().trim().escape()],
  checkAuthorization,
  postReview
);

module.exports = router;
