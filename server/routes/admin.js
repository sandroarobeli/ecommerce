const express = require("express");
const { check } = require("express-validator");

const checkAuthorization = require("../utils/checkAuthorization");
const updateDeliveredStatus = require("../controllers/admin/updateDeliveredStatus");

// Initializing the router object
const router = express.Router();

// Update order delivery status. Privileged, requires authorization as Admin
router.patch("/deliver/:orderId", checkAuthorization, updateDeliveredStatus);

module.exports = router;
