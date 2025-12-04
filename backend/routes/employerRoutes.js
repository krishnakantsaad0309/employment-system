const express = require('express');
const router = express.Router();
const {
    getEmployerApplications,
    updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, employer } = require('../middleware/authMiddleware');

router.get('/applications', protect, employer, getEmployerApplications);
router.put('/applications/:id', protect, employer, updateApplicationStatus);

module.exports = router;
