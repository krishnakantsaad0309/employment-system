const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getAllJobs,
    deleteJobByAdmin,
    getAllApplications,
    updateUserRole,
    updateApplicationStatusByAdmin,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.get('/jobs', protect, admin, getAllJobs);
router.delete('/jobs/:id', protect, admin, deleteJobByAdmin);
router.get('/applications', protect, admin, getAllApplications);
router.put('/applications/:id', protect, admin, updateApplicationStatusByAdmin);

module.exports = router;
