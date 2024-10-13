// routes/Profile.js
const express = require('express');
const router = express.Router();
const { updateProfile, deleteAccount, getAllUserDetails } = require('../controllers/Profile');
const authMiddleware = require('../middlewares/authMiddleware'); // Import the auth middleware

// Route to update user profile
router.put('/update', authMiddleware.auth, updateProfile); // Apply auth middleware

// Route to delete user account
router.delete('/delete', authMiddleware.auth, deleteAccount); // Apply auth middleware

// Route to get all user details
router.get('/details', authMiddleware.auth, getAllUserDetails); // Apply auth middleware

module.exports = router;
