const prisma = require('../config/database');

const getAllServices = async (req, res, next) => {
  try {
    const { companyId, categoryId, isActive, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (companyId) where.companyId = BigInt(companyId);
    if (categoryId) where.categoryId = BigInt(categoryId);
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          company: {
            select: {
              id: true,
              name: true,
              city: true,
              verificationStatus: true
            }
          },
          category: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.service.count({ where })
    ]);

    res.json({
      services,
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

const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id: BigInt(id) },
      include: {
        company: {
          include: {
            ratingSummary: true,
            serviceAreas: true
          }
        },
        category: true
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const {
      companyId,
      categoryId,
      name,
      description,
      basePrice,
      durationMinutes
    } = req.body;

    // Verify company ownership
    const company = await prisma.company.findUnique({
      where: { id: BigInt(companyId) }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    if (company.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const service = await prisma.service.create({
      data: {
        companyId: BigInt(companyId),
        categoryId: BigInt(categoryId),
        name,
        description,
        basePrice,
        durationMinutes
      },
      include: {
        company: true,
        category: true
      }
    });

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const service = await prisma.service.findUnique({
      where: { id: BigInt(id) },
      include: { company: true }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (service.company.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedService = await prisma.service.update({
      where: { id: BigInt(id) },
      data: updates,
      include: {
        company: true,
        category: true
      }
    });

    res.json({
      message: 'Service updated successfully',
      service: updatedService
    });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id: BigInt(id) },
      include: { company: true }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (service.company.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.service.delete({
      where: { id: BigInt(id) }
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};