const express = require('express');
const {
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

} = require('../controllers/companies.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllCompanies);
router.post('/', authenticate, authorize('company_admin', 'admin'), createCompany);

router.get('/categories/:categorySlug/service-types/:serviceTypeSlug', getCompaniesByServiceType);
router.get('/staff', authenticate, authorize('company_admin', 'admin'), getCompanyStaff);

router.post('/staff', authenticate, authorize('company_admin', 'admin'), addStaffMember)


router.post('/assign-staff', authenticate, authorize('company_admin', 'admin'), assignStaffToBooking);
router.get('/bookings', authenticate, authorize('company_admin', 'admin'), getCompanyBookings);


router.get('/:id', getCompanyById);
router.put('/:id', authenticate, authorize('company_admin', 'admin'), updateCompany);
router.delete('/:id', authenticate, authorize('company_admin', 'admin'), deleteCompany);
router.get('/:id/details', getCompanyDetails);

router.get('/staff/:id', authenticate, authorize('company_admin', 'admin'), getStaffMemberById);
router.put('/staff/:id', authenticate, authorize('company_admin', 'admin'), updateStaffMember);
router.delete('/staff/:id', authenticate, authorize('company_admin', 'admin'), removeStaffMember);
router.post('/staff/:id/reactivate', authenticate, authorize('company_admin', 'admin'), reactivateStaffMember);



module.exports = router;