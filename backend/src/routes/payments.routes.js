const express = require("express");
const {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  createCheckoutSession,
  completePayment,
  confirmCashReceived,
  createPaypalOrder,
  capturePaypalOrder,
  createCryptmusPayment,
  handleCryptmusWebhook,
  getCryptmusPaymentStatus,
  createBinanceOrder,
  handleBinanceWebhook,
  getBinanceOrderStatus,
} = require("../controllers/payments.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, getAllPayments);
router.get("/:id", authenticate, getPaymentById);
router.post("/", authenticate, createPayment);

router.post("/checkout-session", authenticate, createCheckoutSession);
router.post("/paypal/order", authenticate, createPaypalOrder);
router.post("/paypal/capture", authenticate, capturePaypalOrder);

// 🚀 Cryptmus Crypto Routes
router.post("/cryptmus/init", authenticate, createCryptmusPayment);
router.get(
  "/cryptmus/status/:paymentId",
  authenticate,
  getCryptmusPaymentStatus,
);
router.post("/cryptmus/webhook", handleCryptmusWebhook);

// Legacy Binance Pay Routes (keeping for backwards compatibility)
router.post("/binance/order", authenticate, createBinanceOrder);
router.get("/binance/status/:prepayId", authenticate, getBinanceOrderStatus);
router.post("/binance/webhook", handleBinanceWebhook);

router.post("/complete", authenticate, completePayment);
router.post("/cash/confirm", authenticate, confirmCashReceived);

router.put(
  "/:id",
  authenticate,
  authorize("company_admin", "admin"),
  updatePayment,
);

module.exports = router;
