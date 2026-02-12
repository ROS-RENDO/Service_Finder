const prisma = require('../config/database');


const getMyReviews = async (req, res) => {
  const customerId = req.user.id;

  const reviews = await prisma.review.findMany({
    where: { customerId },
    include: {
      booking: {
        include: {
          service: true,
          company: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(reviews);
};


const getAllReviews = async (req, res, next) => {
  try {
    const { companyId, customerId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (customerId) where.customerId = BigInt(customerId);

    // Filter by company through booking relation
    let bookingWhere = {};
    if (companyId) bookingWhere.companyId = BigInt(companyId);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          ...where,
          booking: bookingWhere
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          customer: {
            select: {
              id: true,
              fullName: true
            }
          },
          booking: {
            select: {
              id: true,
              bookingDate: true,
              service: {
                select: {
                  name: true
                }
              },
              company: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.count({
        where: {
          ...where,
          booking: bookingWhere
        }
      })
    ]);

    res.json({
      reviews,
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

const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id: BigInt(id) },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        booking: {
          include: {
            service: true,
            company: true
          }
        }
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ review });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify booking
    const booking = await prisma.booking.findUnique({
      where: { id: BigInt(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed bookings' });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: BigInt(bookingId) }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Review already exists for this booking' });
    }

    const review = await prisma.review.create({
      data: {
        bookingId: BigInt(bookingId),
        customerId: req.user.id,
        rating,
        comment
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

    // Update company rating summary
    await updateCompanyRating(booking.companyId);

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({
      where: { id: BigInt(id) },
      include: { booking: true }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: BigInt(id) },
      data: { rating, comment },
      include: {
        booking: {
          include: {
            service: true,
            company: true
          }
        }
      }
    });

    // Update company rating summary
    await updateCompanyRating(review.booking.companyId);

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id: BigInt(id) },
      include: { booking: true }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.review.delete({
      where: { id: BigInt(id) }
    });

    // Update company rating summary
    await updateCompanyRating(review.booking.companyId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Helper function to update company rating
async function updateCompanyRating(companyId) {
  const reviews = await prisma.review.findMany({
    where: {
      booking: {
        companyId: companyId
      }
    },
    select: {
      rating: true
    }
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : null;

  await prisma.companyRatingSummary.upsert({
    where: { companyId },
    create: {
      companyId,
      averageRating,
      totalReviews,
      lastUpdated: new Date()
    },
    update: {
      averageRating,
      totalReviews,
      lastUpdated: new Date()
    }
  });
}

const { formatDistanceToNow } = require('date-fns'); // npm install date-fns

const getReviewsByCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Count total reviews for company
    const total = await prisma.review.count({
      where: {
        booking: {
          companyId: BigInt(companyId)
        }
      }
    });

    // Fetch reviews
    const reviews = await prisma.review.findMany({
      where: {
        booking: {
          companyId: BigInt(companyId)
        }
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            avatar: true
            
          }
        },
        booking: {
          select: {
            id: true,
            service: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Map reviews to add timeAgo
    const formattedReviews = reviews.map(review => ({
      id: review.id.toString(),
      rating: review.rating,
      comment: review.comment,
      customer: review.customer,
      booking: review.booking,
      createdAt: review.createdAt,
      timeAgo: formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) // ← here
    }));

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      reviews: formattedReviews
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
  getReviewsByCompany
};