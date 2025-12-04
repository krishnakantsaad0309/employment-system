const express = require('express');
const router = express.Router();
const {
    applyForJob,
    getMyApplications,
    getApplicationById,
    withdrawApplication,
    generateOfferLetter,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, applyForJob)
    .get(protect, getMyApplications);

router.route('/:id')
    .get(protect, getApplicationById)
    .delete(protect, withdrawApplication);

router.get('/:id/offer', protect, generateOfferLetter);

module.exports = router;
