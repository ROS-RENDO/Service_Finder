const prisma = require('../config/database');

// 1️⃣ AVAILABILITY CONTROLLERS
const getMyAvailability = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Find staff record
    const staff = await prisma.companyStaff.findFirst({
      where: {
        userId,
        status: 'active'
      }
    });

    if (!staff) {
      return res.status(403).json({ error: 'Staff record not found' });
    }

    // 2️⃣ Fetch availability
    const availability = await prisma.availabilitySlot.findMany({
      where: {
        staffId: staff.id,
        isAvailable: true
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    });

    res.json({ availability });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};


const createAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, startTime, endTime } = req.body;

    // 1️⃣ Get staff record
    const staff = await prisma.companyStaff.findFirst({
      where: {
        userId,
        status: 'active'
      }
    });

    if (!staff) {
      return res.status(403).json({ error: 'Staff profile not found' });
    }

    // 2️⃣ Validate input
    if (!date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 3️⃣ Prevent overlap
    const overlap = await prisma.availabilitySlot.findFirst({
      where: {
        companyId: staff.companyId,
        staffId: staff.id,
        date: new Date(date),
        isAvailable: true,
        startTime: { lt: new Date(`${date}T${endTime}`) },
        endTime: { gt: new Date(`${date}T${startTime}`) }
      }
    });

    if (overlap) {
      return res.status(400).json({ error: 'Overlapping availability slot' });
    }

    // 4️⃣ Create slot
    const slot = await prisma.availabilitySlot.create({
      data: {
        companyId: staff.companyId,
        staffId: staff.id,
        date: new Date(date),
        startTime: new Date(`${date}T${startTime}`),
        endTime: new Date(`${date}T${endTime}`),
        isAvailable: true
      }
    });

    res.status(201).json({ slot });
  } catch (error) {
    console.error('Create availability error:', error);
    res.status(500).json({ error: 'Failed to create availability' });
  }
};


const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { date, startTime, endTime } = req.body;

    // Check if availability exists and belongs to this user's staff profile
    const existing = await prisma.availabilitySlot.findFirst({
      where: {
        id: BigInt(id),
        staff: {
          userId
        }
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    // Build update data with proper date/time conversion
    const updateData = {};
    
    if (date !== undefined) {
      updateData.date = new Date(date);
    }
    
    if (startTime) {
      const dateStr = date || existing.date.toISOString().split('T')[0];
      updateData.startTime = new Date(`${dateStr}T${startTime}`);
    }
    
    if (endTime) {
      const dateStr = date || existing.date.toISOString().split('T')[0];
      updateData.endTime = new Date(`${dateStr}T${endTime}`);
    }

    const availability = await prisma.availabilitySlot.update({
      where: { id: BigInt(id) },
      data: updateData
    });

    res.json({ availability });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};

const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership through staff relation
    const existing = await prisma.availabilitySlot.findFirst({
      where: {
        id: BigInt(id),
        staff: {
          userId
        }
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    await prisma.availabilitySlot.update({
      where: { id: BigInt(id) },
      data: { isAvailable: false }
    });

    res.json({ message: 'Availability deleted' });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ error: 'Failed to delete availability' });
  }
};


// 2️⃣ SERVICE REQUEST CONTROLLERS

const getPendingServices = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get staff
    const staff = await prisma.companyStaff.findFirst({
      where: { userId, status: 'active' }
    });

    if (!staff) {
      return res.status(403).json({ error: 'Staff record not found' });
    }

    // Pending bookings = service requests
    const pendingBookings = await prisma.booking.findMany({
      where: {
        companyId: staff.companyId,
        status: 'pending'
      },
      include: {
        service: true,
        customer: {
          select: {
            id: true,
            fullName: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ pendingBookings });
  } catch (error) {
    console.error('Error fetching pending services:', error);
    res.status(500).json({ error: 'Failed to fetch pending services' });
  }
};


const approveService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get staff record
    const staff = await prisma.companyStaff.findFirst({
      where: {
        userId,
        status: 'active'
      },
      select: { id: true }
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff profile not found' });
    }

    const service = await prisma.serviceRequest.findFirst({
      where: {
        id: BigInt(id),
        assignedStaffId: staff.id,
        status: 'pending'
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    const updatedService = await prisma.serviceRequest.update({
      where: { id: BigInt(id) },
      data: {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: staff.id
      }
    });

    res.json({ 
      message: 'Service approved successfully', 
      service: updatedService
    });
  } catch (error) {
    console.error('Error approving service:', error);
    res.status(500).json({ error: 'Failed to approve service' });
  }
};

const rejectService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason } = req.body;

    // Get staff record
    const staff = await prisma.companyStaff.findFirst({
      where: {
        userId,
        status: 'active'
      },
      select: { id: true }
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff profile not found' });
    }

    const service = await prisma.serviceRequest.findFirst({
      where: {
        id: BigInt(id),
        assignedStaffId: staff.id,
        status: 'pending'
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    const updatedService = await prisma.serviceRequest.update({
      where: { id: BigInt(id) },
      data: {
        status: 'rejected',
        rejectedAt: new Date(),
        rejectedBy: staff.id,
        rejectionReason: reason || 'No reason provided'
      }
    });

    res.json({ 
      message: 'Service rejected', 
      service: updatedService
    });
  } catch (error) {
    console.error('Error rejecting service:', error);
    res.status(500).json({ error: 'Failed to reject service' });
  }
};

// 3️⃣ BOOKING MANAGEMENT CONTROLLERS

const getStaffBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    // Get staff record
    const staff = await prisma.companyStaff.findFirst({
      where: {
        userId,
        status: 'active'
      }
    });

    if (!staff) {
      return res.status(403).json({ error: 'Staff record not found' });
    }

    // Get bookings for staff's company
    const where = { 
      companyId: staff.companyId
    };
    
    if (status) {
      where.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          service: {
            select: { 
              name: true,
              description: true,
              basePrice: true
            }
          },
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
          }
        },
        orderBy: [
          { bookingDate: 'asc' },
          { startTime: 'asc' }
        ],
        skip,
        take: parseInt(limit)
      }),
      prisma.booking.count({ where })
    ]);

    res.json({
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch bookings' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get staff record
    const staff = await prisma.companyStaff.findFirst({
      where: {
        userId,
        status: 'active'
      }
    });

    if (!staff) {
      return res.status(403).json({ error: 'Staff record not found' });
    }

    const booking = await prisma.booking.findUnique({
  where: { id: BigInt(id) },
  include: {
    service: {
      select: {
        name: true,
        description: true,
        basePrice: true,
        features: true,        // ⭐ ADD THIS
        image: true,           // ⭐ ADD THIS
        durationMin: true,     // ⭐ ADD THIS
        durationMax: true,     // ⭐ ADD THIS
        serviceType: {         // ⭐ ADD THIS
          select: {
            name: true,
            slug: true
          }
        }
      }
    },
    customer: {
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatar: true          // ⭐ ADD THIS
      }
    },
    company: true,
    payment: true,           // ⭐ ADD THIS
    cancellation: true,      // ⭐ ADD THIS
    statusLogs: true         // ⭐ ADD THIS
  }
});

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch booking' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    // Get staff record
    const staff = await prisma.companyStaff.findFirst({
      where: {
        userId,
        status: 'active'
      }
    });

    if (!staff) {
      return res.status(403).json({ error: 'Staff record not found' });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Verify booking belongs to staff's company
    const booking = await prisma.booking.findFirst({
      where: {
        id: BigInt(id),
        companyId: staff.companyId
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Validate status transitions
    const allowedTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    };

    if (!allowedTransitions[booking.status]?.includes(status)) {
      return res.status(400).json({ 
        error: `Cannot transition from ${booking.status} to ${status}` 
      });
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: BigInt(id) },
      data: { 
        status,
        updatedAt: new Date()
      }
    });

    // Log status change
    await prisma.bookingStatusLog.create({
      data: {
        bookingId: BigInt(id),
        oldStatus: booking.status,
        newStatus: status,
        changedBy: BigInt(userId),
        changedAt: new Date()
      }
    });

    res.json({ 
      message: 'Booking status updated successfully', 
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: error.message || 'Failed to update booking status' });
  }
};

module.exports = {
  getMyAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  getPendingServices,
  approveService,
  rejectService,
  getStaffBookings,
  getBookingById,
  updateBookingStatus
};