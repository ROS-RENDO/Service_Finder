const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
  reactivateStaffMember
} = require('../controllers/companies.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// ─── Multer setup for company image uploads ──────────────────────────────────
const uploadDir = path.join(__dirname, '../../uploads/companies');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// ─── Image upload endpoint ────────────────────────────────────────────────────
// POST /api/companies/upload-image
// Returns { url: '/uploads/companies/<filename>' }
router.post(
  '/upload-image',
  authenticate,
  authorize('company_admin', 'admin'),
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const url = `/uploads/companies/${req.file.filename}`;
    res.json({ success: true, url });
  }
);

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