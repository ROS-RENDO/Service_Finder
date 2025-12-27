const prisma = require('../config/database');

const getAllBookings = async (req, res, next) => {
  try {
    const { customerId, companyId, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    // Regular users can only see their own bookings
    if (req.user.role === 'customer') {
      where.customerId = req.user.id;
    } else if (customerId) {
      where.customerId = BigInt(customerId);
    }
    
    if (companyId) where.companyId = BigInt(companyId);
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          customer: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true
            }
          },
          company: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true
            }
          },
          service: {
            select: {
              id: true,
              name: true,
              basePrice: true,
              durationMinutes: true
            }
          },
          payment: true,
          review: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.booking.count({ where })
    ]);

    res.json({
      bookings,
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

const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: BigInt(id) },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            address: true
          }
        },
        service: {
          include: {
            category: true
          }
        },
        payment: true,
        review: true,
        cancellation: true,
        statusLogs: {
          orderBy: { changedAt: 'desc' }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check access rights
    if (req.user.role === 'customer' && booking.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const {
      companyId,
      serviceId,
      bookingDate,
      startTime,
      endTime,
      serviceAddress,
      latitude,
      longitude
    } = req.body;

    // Get service for price calculation
    const service = await prisma.service.findUnique({
      where: { id: BigInt(serviceId) }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (!service.isActive) {
      return res.status(400).json({ error: 'Service is not available' });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId: req.user.id,
        companyId: BigInt(companyId),
        serviceId: BigInt(serviceId),
        bookingDate: new Date(bookingDate),
        startTime,
        endTime,
        serviceAddress,
        latitude,
        longitude,
        totalPrice: service.basePrice,
        status: 'pending'
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        company: {
          select: {
            id: true,
            name: true
          }
        },
        service: true
      }
    });

    // Create status log
    await prisma.bookingStatusLog.create({
      data: {
        bookingId: booking.id,
        newStatus: 'pending',
        changedBy: req.user.id
      }
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: BigInt(id) }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: BigInt(id) },
      data: { status },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        company: {
          select: {
            id: true,
            name: true
          }
        },
        service: true
      }
    });

    // Create status log
    await prisma.bookingStatusLog.create({
      data: {
        bookingId: BigInt(id),
        oldStatus: booking.status,
        newStatus: status,
        changedBy: req.user.id
      }
    });

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: BigInt(id) }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel this booking' });
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: BigInt(id) },
      data: { status: 'cancelled' }
    });

    // Create cancellation record
    await prisma.cancellation.create({
      data: {
        bookingId: BigInt(id),
        cancelledBy: req.user.id,
        reason
      }
    });

    // Create status log
    await prisma.bookingStatusLog.create({
      data: {
        bookingId: BigInt(id),
        oldStatus: booking.status,
        newStatus: 'cancelled',
        changedBy: req.user.id
      }
    });

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking
};