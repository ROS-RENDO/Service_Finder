const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All notification routes require authentication
router.use(authMiddleware);

// Get user's notifications
router.get('/', notificationsController.getNotifications);

// Mark as read (specific ID or 'all')
router.put('/:id/read', notificationsController.markAsRead);

module.exports = router;
