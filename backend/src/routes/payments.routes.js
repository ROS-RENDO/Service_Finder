const express = require("express");
const {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  createCheckoutSession,
  completePayment,
} = require("../controllers/payments.controller");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, getAllPayments);
router.get("/:id", authenticate, getPaymentById);
router.post("/", authenticate, createPayment);

router.post("/checkout-session", authenticate, createCheckoutSession);

router.post("/complete",authenticate,  completePayment);

router.put(
  "/:id",
  authenticate,
  authorize("company_admin", "admin"),
  updatePayment
);

module.exports = router;
