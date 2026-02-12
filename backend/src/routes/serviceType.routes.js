// routes/serviceType.routes.js
const express = require('express');
const {
  getAllServiceTypes,
  getServiceTypesByCategory,
  getServiceTypeBySlug,
  createServiceType,
  updateServiceType,
  deleteServiceType
} = require('../controllers/serviceType.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllServiceTypes);
router.get('/categories/:categorySlug', getServiceTypesByCategory);
router.get('/:slug', getServiceTypeBySlug);

// Admin only routes
router.post('/', authenticate, authorize('admin'), createServiceType);
router.put('/:id', authenticate, authorize('admin'), updateServiceType);
router.delete('/:id', authenticate, authorize('admin'), deleteServiceType);

module.exports = router;