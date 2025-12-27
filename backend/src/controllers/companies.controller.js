const prisma = require('../config/database');

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
            category: true
          }
        },
        serviceAreas: true,
        ratingSummary: true,
        staff: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ company });
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
      email
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

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};