const express = require('express');
const router = express.Router();
const { updateProfile, deleteAccount, getAllUserDetails } = require('../controllers/Profile');

// Route to update user profile
router.put('/update', updateProfile);

// Route to delete user account
router.delete('/delete', deleteAccount);

// Route to get all user details
router.get('/details', getAllUserDetails);

module.exports = router;
