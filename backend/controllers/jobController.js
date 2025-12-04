const Job = require('../models/Job');
const Joi = require('joi');

const jobSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    employmentType: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship').required(),
});

// @desc    Create a new job
// @route   POST /jobs
// @access  Private (Employer)
const createJob = async (req, res) => {
    const { error } = jobSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const job = await Job.create({
            ...req.body,
            employerId: req.user._id,
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a job
// @route   PUT /jobs/:id
// @access  Private (Employer)
const updateJob = async (req, res) => {
    const { error } = jobSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.employerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this job' });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /jobs/:id
// @access  Private (Employer)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.employerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs
// @route   GET /jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const { title, location, employmentType } = req.query;
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (employmentType) {
            query.employmentType = employmentType;
        }

        const jobs = await Job.find(query).populate('employerId', 'name email');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get job by ID
// @route   GET /jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employerId', 'name email');

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createJob, updateJob, deleteJob, getJobs, getJobById };
