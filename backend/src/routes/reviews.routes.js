const express = require('express');
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.post('/', authenticate, createReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

module.exports = router;