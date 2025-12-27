const express = require('express');
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} = require('../controllers/companies.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.post('/', authenticate, authorize('company_admin', 'admin'), createCompany);
router.put('/:id', authenticate, authorize('company_admin', 'admin'), updateCompany);
router.delete('/:id', authenticate, authorize('company_admin', 'admin'), deleteCompany);

module.exports = router;