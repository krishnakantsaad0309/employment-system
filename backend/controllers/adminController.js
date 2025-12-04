const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all users
// @route   GET /admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const query = {};
        if (role) {
            query.role = role;
        }
        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs
// @route   GET /admin/jobs
// @access  Private (Admin)
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('employerId', 'name email');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /admin/jobs/:id
// @access  Private (Admin)
const deleteJobByAdmin = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        await job.deleteOne();
        res.json({ message: 'Job removed by admin' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications
// @route   GET /admin/applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('jobId', 'title')
            .populate('applicantId', 'name email');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role
// @route   PUT /admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res) => {
    const { role } = req.body;

    if (!['admin', 'employer', 'job_seeker'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'User role updated', user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status (Admin)
// @route   PUT /admin/applications/:id
// @access  Private (Admin)
const updateApplicationStatusByAdmin = async (req, res) => {
    const { status } = req.body;

    if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getAllUsers, 
    getAllJobs, 
    deleteJobByAdmin, 
    getAllApplications,
    updateUserRole,
    updateApplicationStatusByAdmin
};
