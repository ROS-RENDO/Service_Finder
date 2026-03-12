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
} = require("../controllers/payments.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, getAllPayments);
router.get("/:id", authenticate, getPaymentById);
router.post("/", authenticate, createPayment);

router.post("/checkout-session", authenticate, createCheckoutSession);
router.post("/paypal/order", authenticate, createPaypalOrder);
router.post("/paypal/capture", authenticate, capturePaypalOrder);

router.post("/complete", authenticate, completePayment);
router.post("/cash/confirm", authenticate, confirmCashReceived);

router.put(
  "/:id",
  authenticate,
  authorize("company_admin", "admin"),
  updatePayment
);

module.exports = router;
