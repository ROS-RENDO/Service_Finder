const express = require('express');
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/services.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', authenticate, authorize('company_admin', 'admin'), createService);
router.put('/:id', authenticate, authorize('company_admin', 'admin'), updateService);
router.delete('/:id', authenticate, authorize('company_admin', 'admin'), deleteService);

module.exports = router;