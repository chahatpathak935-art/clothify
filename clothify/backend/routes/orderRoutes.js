const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

router.use(protect);

router.post("/create-payment-intent", createPaymentIntent);
router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/", admin, getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", admin, updateOrderStatus);

module.exports = router;
