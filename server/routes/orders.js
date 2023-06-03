const express = require("express");

const checkAuthorization = require("../utils/checkAuthorization");
const getOrderById = require("../controllers/orders/getOrderById");
const placeOrder = require("../controllers/orders/placeOrder");
const updatePaidStatus = require("../controllers/orders/updatePaidStatus");

// Initializing the router object
const router = express.Router();

// Retrieve an order by its id. Privileged, requires authorization
router.get("/order/:orderId", checkAuthorization, getOrderById);

// place order. Privileged, requires authorization
router.post("/place-order", checkAuthorization, placeOrder);

// Update order paid status. Privileged, requires authorization
router.patch("/pay/:orderId", checkAuthorization, updatePaidStatus);

module.exports = router;
