const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');
const {
  getAllCompanies,
  getCompanyById,
  getCompanyMe,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompaniesByCategory,
  getCompaniesByServiceType,
  getCompanyDetails,
  getCompanyStaff,
  assignStaffToBooking,
  getCompanyBookings,
  getCompanyBookingById,
  addStaffMember,
  getStaffMemberById,
  updateStaffMember,
  removeStaffMember,
  reactivateStaffMember,
  getAdminStats
} = require('../controllers/companies.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// ─── Multer setup for Cloudinary image uploads ──────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'service-finder/companies',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }], // resize large images
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ─── Image upload endpoint ────────────────────────────────────────────────────
// POST /api/companies/upload-image
// Returns { url: 'https://res.cloudinary.com/...' }
router.post(
  '/upload-image',
  authenticate,
  authorize('company_admin', 'admin'),
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    // Cloudinary returns the secure url in req.file.path
    res.json({ success: true, url: req.file.path });
  }
);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.get('/admin/stats', authenticate, authorize('admin'), getAdminStats);

// ─── Public routes ────────────────────────────────────────────────────────────
router.get('/', getAllCompanies);
router.get('/categories/:categorySlug', getCompaniesByCategory);
router.get('/categories/:categorySlug/service-types/:serviceTypeSlug', getCompaniesByServiceType);

// ─── Protected company-scoped routes (must come BEFORE /:id) ─────────────────
router.post('/', authenticate, authorize('company_admin', 'admin'), createCompany);
router.get('/me', authenticate, authorize('company_admin', 'admin'), getCompanyMe);
router.get('/staff', authenticate, authorize('company_admin', 'admin'), getCompanyStaff);
router.post('/staff', authenticate, authorize('company_admin', 'admin'), addStaffMember);
router.post('/assign-staff', authenticate, authorize('company_admin', 'admin'), assignStaffToBooking);
router.get('/bookings', authenticate, authorize('company_admin', 'admin'), getCompanyBookings);
router.get('/bookings/:id', authenticate, authorize('company_admin', 'admin'), getCompanyBookingById);

// ─── Staff member CRUD (must come BEFORE /:id to avoid conflict) ─────────────
router.get('/staff/:id', authenticate, authorize('company_admin', 'admin'), getStaffMemberById);
router.put('/staff/:id', authenticate, authorize('company_admin', 'admin'), updateStaffMember);
router.delete('/staff/:id', authenticate, authorize('company_admin', 'admin'), removeStaffMember);
router.post('/staff/:id/reactivate', authenticate, authorize('company_admin', 'admin'), reactivateStaffMember);

// ─── Generic company by ID (must come AFTER all named routes) ────────────────
router.get('/:id', getCompanyById);
router.put('/:id', authenticate, authorize('company_admin', 'admin'), updateCompany);
router.delete('/:id', authenticate, authorize('company_admin', 'admin'), deleteCompany);
router.get('/:id/details', getCompanyDetails);

module.exports = router;