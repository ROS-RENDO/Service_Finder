const prisma = require("../config/database");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getAllPayments = async (req, res, next) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};

    if (req.user.role === "customer") {
      where.userId = req.user.id;
    } else if (userId) {
      where.userId = BigInt(userId);
    }

    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          booking: {
            include: {
              service: {
                select: {
                  name: true,
                },
              },
              company: {
                select: {
                  name: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { paidAt: "desc" },
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: BigInt(id) },
      include: {
        booking: {
          include: {
            service: true,
            company: true,
            customer: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (req.user.role === "customer" && payment.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ payment });
  } catch (error) {
    next(error);
  }
};

const createPayment = async (req, res, next) => {
  try {
    const { bookingId, method, transactionRef } = req.body;

    // Verify booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: BigInt(bookingId) },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.customerId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { bookingId: BigInt(bookingId) },
    });

    if (existingPayment) {
      return res
        .status(400)
        .json({ error: "Payment already exists for this booking" });
    }

    const payment = await prisma.payment.create({
      data: {
        bookingId: BigInt(bookingId),
        userId: req.user.id,
        method,
        amount: booking.totalPrice,
        status: "pending",
        transactionRef,
      },
      include: {
        booking: {
          include: {
            service: true,
            company: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Payment initiated successfully",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, transactionRef } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id: BigInt(id) },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const updateData = { status };
    if (transactionRef) updateData.transactionRef = transactionRef;
    if (status === "paid") updateData.paidAt = new Date();

    const updatedPayment = await prisma.payment.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: {
        booking: {
          include: {
            service: true,
            company: true,
          },
        },
      },
    });

    res.json({
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    next(error);
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ error: "bookingId is required" });
    }

    const bookingIdBigInt = BigInt(bookingId);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingIdBigInt },
      include: { service: true, company: true, customer: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.customerId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        error: "This booking has already been processed",
      });
    }

    // Check if payment already exists and is paid
    const existingPayment = await prisma.payment.findUnique({
      where: { bookingId: bookingIdBigInt },
    });

    if (existingPayment && existingPayment.status === "paid") {
      return res.status(400).json({
        error: "Payment already completed for this booking",
      });
    }

    // ✅ CRITICAL FIX: Convert to cents (Stripe requires smallest currency unit)
    // If your database stores in dollars, multiply by 100
    // If already in cents, use as-is

    // Calculate service fee in cents
    const serviceFeeInCents = Math.round(
      Number(booking.service.basePrice) * 100
    );

    // Calculate platform fee in cents
    const platformFeeInCents = Math.round(Number(booking.platformFee) * 100);
    const totalPriceInCents = Math.round(Number(booking.totalPrice) * 100);

    console.log("Payment amounts:", {
      serviceFee: Number(booking.service.basePrice),
      totalPrice: Number(booking.totalPrice),
      serviceFeeInCents,
      platformFeeInCents,
      totalPriceInCents,
    });

    // ✅ Create Stripe Checkout Session with amounts in cents
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.service.name,
              description: `Cleaning service by ${booking.company.name}`,
              metadata: {
                bookingId: bookingId.toString(),
                companyName: booking.company.name,
              },
            },
            unit_amount: serviceFeeInCents, // ✅ In cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Platform Fee",
              description: "Service platform fee",
            },
            unit_amount: platformFeeInCents, // ✅ In cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/customer/bookings/${bookingId}/payments/success?booking_id=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
      // Redirect route for cancelled / failed / expired flows on the frontend
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancelled?booking_id=${bookingId}&reason=cancelled`,
      customer_email: booking.customer.email,
      client_reference_id: bookingId.toString(),
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user.id.toString(),
        customerName: booking.customer.fullName,
      },
    });

    // ✅ Create or update payment record
    if (existingPayment) {
      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          transactionRef: session.id,
          status: "pending",
          method: "card",
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          bookingId: bookingIdBigInt,
          userId: req.user.id,
          method: "card",
          amount: Number(booking.totalPrice), // ✅ Store in dollars in DB
          status: "pending",
          transactionRef: session.id,
        },
      });
    }

    console.log("Checkout session created:", {
      sessionId: session.id,
      url: session.url,
    });

    return res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return res.status(500).json({
      error: error.message || "Failed to create checkout session",
    });
  }
};

/**
 * Handle Stripe Webhook Events
 */
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // ✅ Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("✅ Webhook verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case "checkout.session.expired":
        await handleCheckoutSessionExpired(event.data.object);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

/**
 * ✅ Handle successful checkout session
 * This is triggered when customer completes Stripe Checkout
 */
const handleCheckoutSessionCompleted = async (session) => {
  try {
    console.log("💳 Processing checkout session:", session.id);

    const bookingId = BigInt(session.metadata.bookingId);
    const userId = BigInt(session.metadata.userId);

    // Update payment status to paid
    const payment = await prisma.payment.findFirst({
      where: {
        bookingId,
        transactionRef: session.id,
      },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "paid",
          paidAt: new Date(),
        },
      });
      console.log("✅ Payment updated to paid:", payment.id);
    }

    // Update booking status to confirmed
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "confirmed",
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: "Payment Successful",
        message: `Your payment for booking #${bookingId} has been confirmed.`,
        isRead: false,
      },
    });

    console.log(`✅ Booking ${bookingId} confirmed`);
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
    throw error;
  }
};

/**
 * Handle expired checkout session
 */
const handleCheckoutSessionExpired = async (session) => {
  try {
    console.log("⏰ Checkout session expired:", session.id);

    const bookingId = BigInt(session.metadata.bookingId);

    const payment = await prisma.payment.findFirst({
      where: {
        bookingId,
        transactionRef: session.id,
      },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
        },
      });
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "cancelled",
      },
    });

    console.log(`⚠️ Booking ${bookingId} cancelled due to expired session`);
  } catch (error) {
    console.error("Error handling checkout session expired:", error);
    throw error;
  }
};

/**
 * Handle successful payment intent
 */
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  console.log("💰 Payment intent succeeded:", paymentIntent.id);
};

/**
 * Handle failed payment intent
 */
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    console.log("❌ Payment intent failed:", paymentIntent.id);

    const payment = await prisma.payment.findFirst({
      where: {
        transactionRef: paymentIntent.id,
      },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
        },
      });

      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: "cancelled",
        },
      });
    }
  } catch (error) {
    console.error("Error handling payment failure:", error);
    throw error;
  }
};

/**
 * Complete payment for cash or wallet methods (non-Stripe)
 */
const completePayment = async (req, res, next) => {
  try {
    const { bookingId, method } = req.body;

    // Only allow cash or wallet methods through this endpoint
    if (method === "card") {
      return res.status(400).json({
        error: "Please use Stripe Checkout for card payments",
      });
    }

    // Verify booking
    const booking = await prisma.booking.findUnique({
      where: { id: BigInt(bookingId) },
      include: {
        service: true,
        company: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.customerId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        error: "This booking has already been processed",
        currentStatus: booking.status
      });
    }

    // ✅ Use transaction to ensure both payment and booking are updated together
    const result = await prisma.$transaction(async (tx) => {
      // Check for existing payment
      const existingPayment = await tx.payment.findUnique({
        where: { bookingId: BigInt(bookingId) },
      });

      // Create or update payment
      let payment;
      if (existingPayment) {
        payment = await tx.payment.update({
          where: { id: existingPayment.id },
          data: {
            method,
            status: method === "cash" ? "pending" : "paid",
            paidAt: method === "cash" ? null : new Date(),
          },
        });
      } else {
        payment = await tx.payment.create({
          data: {
            bookingId: BigInt(bookingId),
            userId: req.user.id,
            method,
            amount: booking.totalPrice,
            status: method === "cash" ? "pending" : "paid",
            paidAt: method === "cash" ? null : new Date(),
          },
        });
      }

      // Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id: BigInt(bookingId) },
        data: {
          status: "confirmed",
        },
      });

      // Create status log
      await tx.bookingStatusLog.create({
        data: {
          bookingId: BigInt(bookingId),
          oldStatus: "pending",
          newStatus: "confirmed",
          changedBy: req.user.id,
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: req.user.id,
          title: method === "cash" ? "Booking Confirmed" : "Payment Successful",
          message:
            method === "cash"
              ? `Your booking has been confirmed. Please pay $${booking.totalPrice} in cash when the service is provided.`
              : `Your payment of $${booking.totalPrice} has been processed successfully.`,
          isRead: false,
        },
      });

      return { payment, booking: updatedBooking };
    });

    // ✅ Serialize BigInt to string before sending response
    res.json({
      success: true,
      message:
        method === "cash"
          ? "Booking confirmed. Pay cash at service time."
          : "Payment completed successfully!",
      payment: {
        id: result.payment.id.toString(),
        bookingId: result.payment.bookingId.toString(),
        userId: result.payment.userId.toString(),
        method: result.payment.method,
        amount: Number(result.payment.amount),
        status: result.payment.status,
        transactionRef: result.payment.transactionRef,
        paidAt: result.payment.paidAt,
      },
      booking: {
        id: result.booking.id.toString(),
        status: result.booking.status,
      },
    });
  } catch (error) {
    console.error("Complete payment error:", error);
    next(error);
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  createCheckoutSession,
  handleStripeWebhook,
  completePayment,
};
