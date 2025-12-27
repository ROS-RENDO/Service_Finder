const prisma = require('../config/database');

const getAllPayments = async (req, res, next) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (req.user.role === 'customer') {
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
                  name: true
                }
              },
              company: {
                select: {
                  name: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        },
        orderBy: { paidAt: 'desc' }
      }),
      prisma.payment.count({ where })
    ]);

    res.json({
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
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
                email: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (req.user.role === 'customer' && payment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
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
      where: { id: BigInt(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { bookingId: BigInt(bookingId) }
    });

    if (existingPayment) {
      return res.status(400).json({ error: 'Payment already exists for this booking' });
    }

    const payment = await prisma.payment.create({
      data: {
        bookingId: BigInt(bookingId),
        userId: req.user.id,
        method,
        amount: booking.totalPrice,
        status: 'pending',
        transactionRef
      },
      include: {
        booking: {
          include: {
            service: true,
            company: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Payment initiated successfully',
      payment
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
      where: { id: BigInt(id) }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const updateData = { status };
    if (transactionRef) updateData.transactionRef = transactionRef;
    if (status === 'paid') updateData.paidAt = new Date();

    const updatedPayment = await prisma.payment.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: {
        booking: {
          include: {
            service: true,
            company: true
          }
        }
      }
    });

    res.json({
      message: 'Payment updated successfully',
      payment: updatedPayment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment
};