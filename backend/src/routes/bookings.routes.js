const express = require('express');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookings.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getAllBookings);
router.get('/:id', authenticate, getBookingById);
router.post('/', authenticate, createBooking);
router.patch('/:id/status', authenticate, authorize('company_admin', 'staff', 'admin'), updateBookingStatus);
router.delete('/:id', authenticate, cancelBooking);

module.exports = router;