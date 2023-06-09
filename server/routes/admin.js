const express = require("express");
const { check } = require("express-validator");

const checkAuthorization = require("../utils/checkAuthorization");
const updateDeliveredStatus = require("../controllers/admin/updateDeliveredStatus");
const getSummary = require("../controllers/admin/getSummary");
const getOrders = require("../controllers/admin/getOrders");

// Initializing the router object
const router = express.Router();

// Update order delivery status. Privileged, requires authorization as Admin
router.patch("/deliver/:orderId", checkAuthorization, updateDeliveredStatus);

// Retrieve sales summary. Privileged, requires authorization as Admin
router.get("/summary", checkAuthorization, getSummary);

// Retrieve complete list of orders. Privileged, requires authorization as Admin
router.get("/orders", checkAuthorization, getOrders);

module.exports = router;
