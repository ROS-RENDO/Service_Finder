const prisma = require('../config/database');
const bcrypt = require('bcrypt');

const getAllCompanies = async (req, res, next) => {
  try {
    const { status, city, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.verificationStatus = status;
    if (city) where.city = city;

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          owner: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true
            }
          },
          ratingSummary: true,
          _count: {
            select: {
              services: true,
              bookings: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.company.count({ where })
    ]);

    res.json({
      companies,
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

const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id: BigInt(id) },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        services: {
          where: { isActive: true },
          include: {
            serviceType: {
              include: {
                category: true
              }
            }
          }
        },
        serviceAreas: {
          select: {
            city: true,
            coverageRadiusKm: true
          }
        },
        ratingSummary: true,
        staff: {
          where: { status: 'active' }, // Only count active staff
          select: {
            id: true
          }
        }
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Calculate years in business from createdAt or foundedYear
    const yearsInBusiness = company.foundedYear 
      ? new Date().getFullYear() - company.foundedYear
      : company.createdAt 
        ? new Date().getFullYear() - new Date(company.createdAt).getFullYear()
        : 0;

    // Format the response
    const formattedCompany = {
      id: company.id.toString(),
      name: company.name,
      slug: company.slug,
      description: company.description,
      
      // Media
      logoUrl: company.logoUrl,
      coverImageUrl: company.coverImageUrl,
      
      // Contact info
      phone: company.phone,
      email: company.email,
      address: company.address,
      city: company.city,
      state: company.state,
      zipCode: company.zipCode,
      country: company.country,
      
      // Location
      coordinate: {
        latitude: company.latitude ? parseFloat(company.latitude) : null,
        longitude: company.longitude ? parseFloat(company.longitude) : null,
      },
      location: company.city || company.address,
      
      // Verification
      verified: company.verificationStatus === 'verified',
      verificationStatus: company.verificationStatus,
      verifiedAt: company.verifiedAt,
      
      // Stats
      rating: company.ratingSummary?.averageRating 
        ? parseFloat(company.ratingSummary.averageRating) 
        : null,
      reviewCount: company.ratingSummary?.totalReviews || 0,
      yearsInBusiness,
      employeeCount: company.employeeCount || company.staff?.length || 0, // Use stored value or count staff
      
      // Service areas
      serviceAreas: company.serviceAreas || [],
      
      // Status
      status: company.status,
      Highlights: company.detailHighlights || [],
      service: company.services,
      
      // Timestamps
      createdAt: company.createdAt,
      updatedAt: company.updatedAt
    };

    res.json({
      success: true,
      data: formattedCompany
    });
  } catch (error) {
    next(error);
  }
};

const createCompany = async (req, res, next) => {
  try {
    const {
      name,
      description,
      registrationNumber,
      address,
      city,
      latitude,
      longitude,
      phone,
      email,
      logoUrl,
      coverImageUrl,
      establishedYear,
      
    } = req.body;

    const company = await prisma.company.create({
      data: {
        name,
        description,
        registrationNumber,
        address,
        city,
        latitude,
        longitude,
        phone,
        email,
            logoUrl,
    coverImageUrl,
    establishedYear,
        ownerId: req.user.id
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Company created successfully',
      company
    });
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check ownership or admin role
    const company = await prisma.company.findUnique({
      where: { id: BigInt(id) }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    if (company.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedCompany = await prisma.company.update({
      where: { id: BigInt(id) },
      data: updates,
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Company updated successfully',
      company: updatedCompany
    });
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id: BigInt(id) }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    if (company.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.company.delete({
      where: { id: BigInt(id) }
    });

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getCompaniesByServiceType = async (req, res, next) => {
  try {
    const { categorySlug, serviceTypeSlug } = req.params;
    const { search, city, minRating, sortBy = 'rating', page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get category and service type
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });

    if (!category || category.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const serviceType = await prisma.serviceType.findUnique({
      where: { slug: serviceTypeSlug, categoryId: category.id }
    });

    if (!serviceType || serviceType.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Service type not found'
      });
    }

    // Build where clause
    let whereClause = {
      verificationStatus: 'verified',
      services: {
        some: {
          serviceTypeId: serviceType.id,
          isActive: true
        }
      }
    };

    // Add search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add city filter
    if (city) {
      whereClause.city = city;
    }

    // Get companies with pagination
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: whereClause,
        skip,
        take: parseInt(limit),
        include: {
          ratingSummary: true,
          services: {
            where: {
              serviceTypeId: serviceType.id,
              isActive: true
            },
            select: {
              id: true,
              name: true,
              basePrice: true,
                durationMin: true,    
                durationMax: true,
            }
          },
          serviceAreas: {
            select: {
              city: true,
              coverageRadiusKm: true
            }
          }
        }
      }),
      prisma.company.count({ where: whereClause })
    ]);

    // Filter by rating if specified
    let filteredCompanies = companies;
    if (minRating) {
      filteredCompanies = companies.filter(c => 
        c.ratingSummary && parseFloat(c.ratingSummary.averageRating) >= parseFloat(minRating)
      );
    }

    // Sort companies
    if (sortBy === 'rating') {
      filteredCompanies.sort((a, b) => {
        const ratingA = a.ratingSummary?.averageRating || 0;
        const ratingB = b.ratingSummary?.averageRating || 0;
        return parseFloat(ratingB) - parseFloat(ratingA);
      });
    } else if (sortBy === 'reviews') {
      filteredCompanies.sort((a, b) => {
        const reviewsA = a.ratingSummary?.totalReviews || 0;
        const reviewsB = b.ratingSummary?.totalReviews || 0;
        return reviewsB - reviewsA;
      });
    } else if (sortBy === 'price_low') {
      filteredCompanies.sort((a, b) => {
        const priceA = a.services[0]?.basePrice || 0;
        const priceB = b.services[0]?.basePrice || 0;
        return parseFloat(priceA) - parseFloat(priceB);
      });
    } else if (sortBy === 'price_high') {
      filteredCompanies.sort((a, b) => {
        const priceA = a.services[0]?.basePrice || 0;
        const priceB = b.services[0]?.basePrice || 0;
        return parseFloat(priceB) - parseFloat(priceA);
      });
    }

    // Format response
    const currentYear = new Date().getFullYear();

const formattedCompanies = filteredCompanies.map(company => {
  const prices = (company.services || []).map(s => Number(s.basePrice));
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return {
    id: company.id.toString(),
    name: company.name,

    logoUrl: company.logoUrl,
    coverImageUrl: company.coverImageUrl,

    rating: company.ratingSummary?.averageRating
      ? Number(company.ratingSummary.averageRating)
      : null,

    reviews: company.ratingSummary?.totalReviews ?? 0,

    location: company.serviceAreas.length > 0 ? 'All Areas' : company.city,

    coordinate: {
      latitude: company.latitude ? Number(company.latitude) : null,
      longitude: company.longitude ? Number(company.longitude) : null,
    },
    verified: company.verificationStatus === 'verified',

    yearsInBusiness: company.establishedYear
      ? currentYear - company.establishedYear
      : null,

    priceRange: {
      min: minPrice,
      max: maxPrice
    },

    description: company.description,

    highlights: Array.isArray(company.cardHighlights)
  ? company.cardHighlights
  : [],

    responseTime: 'Usually responds in 1 hour'
  };
});


    res.json({
      success: true,
      data: {
        category: {
          id: category.id.toString(),
          name: category.name,
          slug: category.slug
        },
        serviceType: {
          id: serviceType.id.toString(),
          name: serviceType.name,
          slug: serviceType.slug,
          icon: serviceType.icon,
        },
        companies: formattedCompanies,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCompanyDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: {
        id: BigInt(id),
        verificationStatus: 'verified'
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        services: {
          where: {
            isActive: true
          },
          include: {
            serviceType: {
              include: {
                category: true
              }
            }
          },
          orderBy: {
            basePrice: 'asc'
          }
        },
        ratingSummary: true,
        serviceAreas: true,
        bookings: {
          where: {
            status: 'completed',
            review: {
              isNot: null
            }
          },
          include: {
            review: {
              include: {
                customer: {
                  select: {
                    id: true,
                    fullName: true
                  }
                }
              }
            },
            service: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Format services
    const formattedServices = company.services.map(service => ({
      id: service.id.toString(),
      name: service.name,
      description: service.description,
      basePrice: parseFloat(service.basePrice),
      durationMinutes: service.durationMinutes,
      category: service.serviceType.category.name,
      categorySlug: service.serviceType.category.slug,
      serviceType: service.serviceType.name,
      serviceTypeSlug: service.serviceType.slug,
      isActive: service.isActive
    }));

    // Format reviews
    const reviews = company.bookings
      .filter(booking => booking.review)
      .map(booking => ({
        id: booking.review.id.toString(),
        rating: booking.review.rating,
        comment: booking.review.comment,
        createdAt: booking.review.createdAt,
        service: booking.service?.name || 'Service',
        customer: {
          id: booking.review.customer.id.toString(),
          name: booking.review.customer.fullName
        }
      }));

    // Calculate years in business
    const yearsInBusiness = new Date().getFullYear() - new Date(company.createdAt).getFullYear();

    res.json({
      success: true,
      data: {
        id: company.id.toString(),
        name: company.name,
        description: company.description,
        registrationNumber: company.registrationNumber,
        address: company.address,
        city: company.city,
        coordinate: {
          latitude: company.latitude ? parseFloat(company.latitude) : null,
          longitude: company.longitude ? parseFloat(company.longitude) : null,
        },
        phone: company.phone,
        email: company.email,
        verificationStatus: company.verificationStatus,
        rating: company.ratingSummary?.averageRating 
          ? parseFloat(company.ratingSummary.averageRating) 
          : null,
        reviewCount: company.ratingSummary?.totalReviews || 0,
        yearsInBusiness,
        services: formattedServices,
        serviceAreas: company.serviceAreas,
        reviews: reviews,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};


const getCompanyStaff = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);

    // Find company owned by this user
    const company = await prisma.company.findFirst({
      where: {
        ownerId: userId,
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Fetch all staff members
    const staffMembers = await prisma.companyStaff.findMany({
      where: {
        companyId: company.id,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get additional details for each staff member
    const staffWithDetails = await Promise.all(
      staffMembers.map(async (staffMember) => {
        // Count active service requests
        const activeRequests = await prisma.serviceRequest.count({
          where: {
            assignedStaffId: staffMember.id,
            status: {
              in: ['pending', 'approved'],
            },
          },
        });

        // Count completed jobs (service requests that are completed)
        const completedJobs = await prisma.serviceRequest.count({
          where: {
            assignedStaffId: staffMember.id,
            status: 'approved', // or add 'completed' if you have that status
          },
        });

        // Get all completed bookings for this staff to calculate average rating
        // Note: Reviews are for bookings, not individual staff
        // We'll get the average rating from bookings where this staff was assigned
        const completedBookings = await prisma.serviceRequest.findMany({
  where: {
    companyId: company.id,
    assignedStaffId: staffMember.id,
    status: 'approved', // only approved/completed requests
  },
  include: {
    company: true, // optional
    service: true, // optional
    customer: true, // optional
    // include the booking and its review
    service: {
      include: {
        bookings: {
          where: {
            status: 'completed'
          },
          include: {
            review: true
          }
        }
      }
    }
  }
});

        // Calculate average rating from completed bookings with reviews
        const reviewedBookings = completedBookings.filter(b => b.review);
        const averageRating = reviewedBookings.length > 0
          ? reviewedBookings.reduce((sum, b) => sum + (b.review?.rating || 0), 0) / reviewedBookings.length
          : null;

        // Check availability today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAvailability = await prisma.availabilitySlot.findFirst({
          where: {
            staffId: staffMember.id,
            date: {
              gte: today,
              lt: tomorrow,
            },
            isAvailable: true,
          },
        });

        return {
          id: staffMember.id.toString(),
          userId: staffMember.user.id.toString(),
          fullName: staffMember.user.fullName,
          email: staffMember.user.email,
          avatar: staffMember.user.avatar,
          phone: staffMember.user.phone,
          role: staffMember.role,
          status: staffMember.status,
          activeRequests,
          completedJobs,
          averageRating: averageRating ? Number(averageRating.toFixed(1)) : null,
          totalReviews: reviewedBookings.length,
          isAvailable: !!todayAvailability,
          joinedAt: staffMember.createdAt,
        };
      })
    );

    res.json({
      success: true,
      staff: staffWithDetails,
    });
  } catch (error) {
    console.error('Error fetching company staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff members' });
  }
};

// POST /api/companies/assign-staff - Assign staff to a booking
const assignStaffToBooking = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const {
      bookingId,
      staffId, // This is CompanyStaff.id, not User.id
      notes,
    } = req.body;

    // Validate required fields
    if (!bookingId || !staffId) {
      return res.status(400).json({ error: 'Missing required fields: bookingId and staffId' });
    }

    // Find company owned by this user
    const company = await prisma.company.findFirst({
      where: {
        ownerId: userId,
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Fetch the booking
    const booking = await prisma.booking.findUnique({
      where: { id: BigInt(bookingId) },
      include: {
        service: true,
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify the booking belongs to this company
    if (booking.companyId.toString() !== company.id.toString()) {
      return res.status(403).json({ error: 'Unauthorized: Booking does not belong to your company' });
    }

    // Verify staff member exists and belongs to this company
    const staffMember = await prisma.companyStaff.findFirst({
      where: {
        id: BigInt(staffId),
        companyId: company.id,
        status: 'active',
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!staffMember) {
      return res.status(404).json({ 
        error: 'Staff member not found or not active in this company' 
      });
    }

    // Check if there's already a service request for this booking
    const existingRequest = await prisma.serviceRequest.findFirst({
      where: {
        companyId: company.id,
        customerId: booking.customerId,
        serviceId: booking.serviceId,
        status: {
          in: ['pending', 'approved'],
        },
      },
    });

    if (existingRequest) {
      // Update existing request
      const updatedRequest = await prisma.serviceRequest.update({
        where: { id: existingRequest.id },
        data: {
          assignedStaffId: staffMember.id,
          notes: notes || null,
          updatedAt: new Date(),
        },
        include: {
          assignedStaff: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      // Update booking status to confirmed if it's pending
      if (booking.status === 'pending') {
        await prisma.booking.update({
          where: { id: BigInt(bookingId) },
          data: {
            status: 'confirmed',
            updatedAt: new Date(),
          },
        });

        // Log status change
        await prisma.bookingStatusLog.create({
          data: {
            bookingId: BigInt(bookingId),
            oldStatus: 'pending',
            newStatus: 'confirmed',
            changedBy: userId,
            changedAt: new Date(),
          },
        });
      }

      return res.json({
        success: true,
        message: 'Staff assigned successfully',
        serviceRequest: {
          ...updatedRequest,
          id: updatedRequest.id.toString(),
          assignedStaff: {
            ...updatedRequest.assignedStaff.user,
            id: updatedRequest.assignedStaff.user.id.toString(),
          },
        },
      });
    }

    // Create new service request
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        customerId: booking.customerId,
        companyId: company.id,
        serviceId: booking.serviceId,
        assignedStaffId: staffMember.id,
        requestedDate: booking.bookingDate,
        requestedTime: booking.startTime,
        serviceAddress: booking.serviceAddress,
        latitude: booking.latitude,
        longitude: booking.longitude,
        status: 'pending',
        notes: notes || null,
      },
      include: {
        assignedStaff: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Update booking status to confirmed if it's pending
    if (booking.status === 'pending') {
      await prisma.booking.update({
        where: { id: BigInt(bookingId) },
        data: {
          status: 'confirmed',
          updatedAt: new Date(),
        },
      });

      // Log status change
      await prisma.bookingStatusLog.create({
        data: {
          bookingId: BigInt(bookingId),
          oldStatus: 'pending',
          newStatus: 'confirmed',
          changedBy: userId,
          changedAt: new Date(),
        },
      });
    }

    // Convert BigInt to string for JSON response
    const response = {
      ...serviceRequest,
      id: serviceRequest.id.toString(),
      customerId: serviceRequest.customerId.toString(),
      companyId: serviceRequest.companyId.toString(),
      serviceId: serviceRequest.serviceId.toString(),
      assignedStaffId: serviceRequest.assignedStaffId?.toString(),
      assignedStaff: serviceRequest.assignedStaff ? {
        ...serviceRequest.assignedStaff.user,
        id: serviceRequest.assignedStaff.user.id.toString(),
      } : null,
    };

    res.status(201).json({
      success: true,
      message: 'Staff assigned successfully',
      serviceRequest: response,
    });
  } catch (error) {
    console.error('Error assigning staff to booking:', error);
    res.status(500).json({ error: 'Failed to assign staff to booking' });
  }
};

// GET /api/companies/bookings - Get all bookings for company with assigned staff info
const getCompanyBookings = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { status, page = 1, limit = 10 } = req.query;

    // Find company owned by this user
    const company = await prisma.company.findFirst({
      where: {
        ownerId: userId,
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Build where clause
    const where = {
      companyId: company.id,
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch bookings with all related data
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              basePrice: true,
              image: true,
            },
          },
          payment: {
            select: {
              id: true,
              status: true,
              method: true,
              amount: true,
            },
          },
        },
        orderBy: [
          { bookingDate: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: parseInt(limit),
      }),
      prisma.booking.count({ where }),
    ]);

    // Get service request info for each booking (to find assigned staff)
    const bookingsWithStaff = await Promise.all(
      bookings.map(async (booking) => {
        const serviceRequest = await prisma.serviceRequest.findFirst({
          where: {
            companyId: company.id,
            customerId: booking.customerId,
            serviceId: booking.serviceId,
            requestedDate: booking.bookingDate,
          },
          include: {
            assignedStaff: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        return {
          ...booking,
          id: booking.id.toString(),
          customerId: booking.customerId.toString(),
          companyId: booking.companyId.toString(),
          serviceId: booking.serviceId.toString(),
          customer: {
            ...booking.customer,
            id: booking.customer.id.toString(),
          },
          service: {
            ...booking.service,
            id: booking.service.id.toString(),
          },
          payment: booking.payment ? {
            ...booking.payment,
            id: booking.payment.id.toString(),
          } : null,
          assignedStaff: serviceRequest?.assignedStaff ? {
            id: serviceRequest.assignedStaff.user.id.toString(),
            fullName: serviceRequest.assignedStaff.user.fullName,
            avatar: serviceRequest.assignedStaff.user.avatar,
          } : null,
        };
      })
    );

    res.json({
      success: true,
      bookings: bookingsWithStaff,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching company bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};


const addStaffMember = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { 
      email, 
      fullName, 
      phone, 
      role, // 'cleaner' or 'supervisor'
      password // Optional - if not provided, generate temporary password
    } = req.body;

    // Validate required fields
    if (!email || !fullName || !phone || !role) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, fullName, phone, role' 
      });
    }

    // Validate role
    const validRoles = ['cleaner', 'supervisor'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be "cleaner" or "supervisor"' 
      });
    }

    // Find company owned by this user
    const company = await prisma.company.findFirst({
      where: {
        ownerId: userId,
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let newUser;

    if (existingUser) {
      // User exists - check if they're already staff in this company
      const existingStaff = await prisma.companyStaff.findFirst({
        where: {
          companyId: company.id,
          userId: existingUser.id,
        },
      });

      if (existingStaff) {
        return res.status(400).json({ 
          error: 'This user is already a staff member in your company' 
        });
      }

      // Add existing user as staff
      newUser = existingUser;
    } else {
      // Create new user account
      const tempPassword = password || `temp${Math.random().toString(36).slice(-8)}`;
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      newUser = await prisma.user.create({
        data: {
          email,
          fullName,
          phone,
          passwordHash: hashedPassword,
          role: 'staff',
          status: 'active',
        },
      });

      // TODO: Send welcome email with temporary password
      console.log(`New user created with temp password: ${tempPassword}`);
    }

    // Create CompanyStaff record
    const staffMember = await prisma.companyStaff.create({
      data: {
        companyId: company.id,
        userId: newUser.id,
        role: role,
        status: 'active',
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Staff member added successfully',
      staff: {
        id: staffMember.id.toString(),
        userId: staffMember.user.id.toString(),
        fullName: staffMember.user.fullName,
        email: staffMember.user.email,
        avatar: staffMember.user.avatar,
        phone: staffMember.user.phone,
        role: staffMember.role,
        status: staffMember.status,
        joinedAt: staffMember.createdAt,
      },
    });
  } catch (error) {
    console.error('Error adding staff member:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'A staff member with this email already exists' 
      });
    }
    
    res.status(500).json({ error: 'Failed to add staff member' });
  }
};

/**
 * GET /api/companies/staff/:id
 * Get a single staff member details
 */
const getStaffMemberById = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { id } = req.params;

    // Find company owned by this user
    const company = await prisma.company.findFirst({
      where: {
        ownerId: userId,
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Fetch staff member
    const staffMember = await prisma.companyStaff.findFirst({
      where: {
        id: BigInt(id),
        companyId: company.id,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
      },
    });

    if (!staffMember) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    // Get service requests
    const serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        assignedStaffId: staffMember.id,
      },
      include: {
        service: {
          select: {
            name: true,
          },
        },
        customer: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        requestedDate: 'desc',
      },
      take: 10,
    });

    res.json({
      success: true,
      staff: {
        id: staffMember.id.toString(),
        userId: staffMember.user.id.toString(),
        fullName: staffMember.user.fullName,
        email: staffMember.user.email,
        avatar: staffMember.user.avatar,
        phone: staffMember.user.phone,
        role: staffMember.role,
        status: staffMember.status,
        joinedAt: staffMember.createdAt,
        serviceRequests: serviceRequests.map(sr => ({
          id: sr.id.toString(),
          status: sr.status,
          requestedDate: sr.requestedDate,
          serviceName: sr.service.name,
          customerName: sr.customer.fullName,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({ error: 'Failed to fetch staff member' });
  }
};

/**
 * PUT /api/companies/staff/:id
 * Update a staff member
 */
const updateStaffMember = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { id } = req.params;
    const { fullName, phone, role, status } = req.body;

    // Find company owned by this user
    const company = await prisma.company.findFirst({
      where: {
        ownerId: userId,
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check if staff member exists
    const staffMember = await prisma.companyStaff.findFirst({
      where: {
        id: BigInt(id),
        companyId: company.id,
      },
      include: {
        user: true,
      },
    });

    if (!staffMember) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    // Update user info if provided
    if (fullName || phone) {
      await prisma.user.update({
        where: { id: staffMember.userId },
        data: {
          ...(fullName && { fullName }),
          ...(phone && { phone }),
        },
      });
    }

    // Update staff info
    const updatedStaff = await prisma.companyStaff.update({
      where: { id: BigInt(id) },
      data: {
        ...(role && { role }),
        ...(status && { status }),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      staff: {
        id: updatedStaff.id.toString(),
        userId: updatedStaff.user.id.toString(),
        fullName: updatedStaff.user.fullName,
        email: updatedStaff.user.email,
        avatar: updatedStaff.user.avatar,
        phone: updatedStaff.user.phone,
        role: updatedStaff.role,
        status: updatedStaff.status,
      },
    });
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).json({ error: 'Failed to update staff member' });
  }
};

/**
 * DELETE /api/companies/staff/:id
 * Remove a staff member from the company
 */
const removeStaffMember = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { id } = req.params;

    // Find company owned by this user
    const company = await prisma.company.findFirst({
      where: {
        ownerId: userId,
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check if staff member exists
    const staffMember = await prisma.companyStaff.findFirst({
      where: {
        id: BigInt(id),
        companyId: company.id,
      },
    });

    if (!staffMember) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    // Check if staff has active service requests
    const activeRequests = await prisma.serviceRequest.count({
      where: {
        assignedStaffId: staffMember.id,
        status: {
          in: ['pending', 'approved'],
        },
      },
    });

    if (activeRequests > 0) {
      return res.status(400).json({ 
        error: `Cannot remove staff member. They have ${activeRequests} active service request(s). Please reassign or complete them first.` 
      });
    }

    // Soft delete - set status to inactive
    await prisma.companyStaff.update({
      where: { id: BigInt(id) },
      data: {
        status: 'inactive',
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Staff member removed successfully',
    });
  } catch (error) {
    console.error('Error removing staff member:', error);
    res.status(500).json({ error: 'Failed to remove staff member' });
  }
};

/**
 * POST /api/companies/staff/:id/reactivate
 * Reactivate an inactive staff member
 */
const reactivateStaffMember = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { id } = req.params;

    // Find company owned by this user
    const company = await prisma.company.findFirst({
      where: {
        ownerId: userId,
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Update staff status
    const staffMember = await prisma.companyStaff.update({
      where: { 
        id: BigInt(id),
      },
      data: {
        status: 'active',
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Staff member reactivated successfully',
      staff: {
        id: staffMember.id.toString(),
        fullName: staffMember.user.fullName,
        status: staffMember.status,
      },
    });
  } catch (error) {
    console.error('Error reactivating staff member:', error);
    res.status(500).json({ error: 'Failed to reactivate staff member' });
  }
};





module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompaniesByServiceType,
  getCompanyDetails,
  getCompanyStaff,
  assignStaffToBooking,
  getCompanyBookings,
  addStaffMember,
  getStaffMemberById,
  updateStaffMember,
  removeStaffMember,
  reactivateStaffMember
};