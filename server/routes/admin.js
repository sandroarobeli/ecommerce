const express = require("express");
const { check } = require("express-validator");

const checkAuthorization = require("../utils/checkAuthorization");
const updateDeliveredStatus = require("../controllers/admin/updateDeliveredStatus");
const getCloudinarySignature = require("../controllers/admin/getCloudinarySignature");
const getSummary = require("../controllers/admin/getSummary");
const getOrders = require("../controllers/admin/getOrders");
const createProduct = require("../controllers/admin/createProduct");
const updateProduct = require("../controllers/admin/updateProduct");
const deleteProduct = require("../controllers/admin/deleteProduct");
const deleteOrder = require("../controllers/admin/deleteOrder");
const getAllUsers = require("../controllers/admin/getAllUsers");
const updateUserStatus = require("../controllers/admin/updateUserStatus");
const deleteUser = require("../controllers/admin/deleteUser");
const updateTaxNShipping = require("../controllers/admin/updateTaxNShipping");
const getTaxNShipping = require("../controllers/admin/getTaxNShipping");
const getAllMessages = require("../controllers/admin/getAllMessages");
const handleMessage = require("../controllers/admin/handleMessage");
const sendReply = require("../controllers/admin/sendReply");

// Initializing the router object
const router = express.Router();

// Update order delivery status. Privileged, requires authorization as Admin
router.patch("/deliver/:orderId", checkAuthorization, updateDeliveredStatus);

// Gain authorization from Cloudinary by receiving signature and timestamp credentials
router.get("/cloudinary-signature", checkAuthorization, getCloudinarySignature);

// Retrieve sales summary. Privileged, requires authorization as Admin
router.get("/summary", checkAuthorization, getSummary);

// Retrieve complete list of orders. Privileged, requires authorization as Admin
router.get("/orders", checkAuthorization, getOrders);

// Create product. Privileged, requires authorization as Admin
router.post(
  "/new-product",
  [
    check("name").not().isEmpty().trim().escape(),
    check("slug").not().isEmpty().trim().escape(),
    check("price").isFloat(),
    check("image").not().isEmpty(),
    check("category").not().isEmpty().trim().escape(),
    check("brand").not().isEmpty().trim().escape(),
    check("inStock").isInt(),
    check("description").not().isEmpty().trim().escape(),
  ],
  checkAuthorization,
  createProduct
);

// Update product. Privileged, requires authorization as Admin
router.patch(
  "/product/:productId",
  [
    check("name").not().isEmpty().trim().escape(),
    check("slug").not().isEmpty().trim().escape(),
    check("price").isFloat(),
    check("image").not().isEmpty(),
    check("category").not().isEmpty().trim().escape(),
    check("brand").not().isEmpty().trim().escape(),
    check("inStock").isInt(),
    check("description").not().isEmpty().trim().escape(),
  ],
  checkAuthorization,
  updateProduct
);

// Delete product. Privileged, requires authorization as Admin
router.delete("/product/:productId", checkAuthorization, deleteProduct);

// Delete order. Privileged, requires authorization as Admin
router.delete("/order/:orderId", checkAuthorization, deleteOrder);

// Retrieve complete Users list. Privileged, requires authorization as Admin
router.get("/users", checkAuthorization, getAllUsers);

// Update user status. Privileged, requires authorization as Admin
router.patch("/user/:updatedUserId", checkAuthorization, updateUserStatus);

// Delete user. Privileged, requires authorization as Admin
router.delete("/user/:deletedUserId", checkAuthorization, deleteUser);

// Update tax and / or shipping rates. Privileged, requires authorization as Admin
router.patch(
  "/tax-and-shipping",
  [check("taxRate").isFloat(), check("shippingRate").isFloat()],
  checkAuthorization,
  updateTaxNShipping
);

// Retrieve current tax and / or shipping rates. No token required since Users need it too
router.get("/tax-and-shipping", getTaxNShipping);

// Retrieve all messages sent by users. Privileged, requires authorization as Admin
router.get("/messages", checkAuthorization, getAllMessages);

// Retrieve message by its id. Privileged, requires authorization as Admin
router.get("/message/:messageId", checkAuthorization, handleMessage);

// Delete message. Privileged, requires authorization as Admin
router.delete("/message/:messageId", checkAuthorization, handleMessage);

// Send reply message. Privileged, requires authorization as Admin
router.post(
  "/reply",
  [
    check("emailTo").not().isEmpty().isEmail().trim().escape(),
    check("subject").trim(),
    check("content").not().isEmpty().trim(),
  ],
  checkAuthorization,
  sendReply
);

module.exports = router;
