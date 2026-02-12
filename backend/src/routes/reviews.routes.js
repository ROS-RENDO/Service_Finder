const express = require('express');
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
  getReviewsByCompany
} = require('../controllers/reviews.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllReviews);
router.get('/my',authenticate, getMyReviews)
router.get('/:id', getReviewById);
router.post('/', authenticate, createReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

router.get('/company/:companyId', getReviewsByCompany);

module.exports = router;