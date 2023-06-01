const express = require("express");

const checkAuthorization = require("../utils/checkAuthorization");
const placeOrder = require("../controllers/orders/placeOrder");

// Initializing the router object
const router = express.Router();

// place order. Privileged, requires authorization
router.post("/place-order", checkAuthorization, placeOrder);

module.exports = router;
