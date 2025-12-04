const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const Joi = require('joi');

// Joi Schemas
const applySchema = Joi.object({
    jobId: Joi.string().required(),
});

// @desc    Apply for a job
// @route   POST /applications
// @access  Private (Job Seeker)
const applyForJob = async (req, res) => {
    const { error } = applySchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { jobId } = req.body;

    try {
        // Check if user is a job seeker
        if (req.user.role !== 'job_seeker') {
            return res.status(403).json({ message: 'Only job seekers can apply for jobs' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const alreadyApplied = await Application.findOne({
            jobId,
            applicantId: req.user._id,
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            jobId,
            applicantId: req.user._id,
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get own applications
// @route   GET /applications
// @access  Private (Job Seeker)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user._id })
            .populate('jobId', 'title location employmentType')
            .populate('applicantId', 'name email');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get application details
// @route   GET /applications/:id
// @access  Private (Job Seeker)
const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId')
            .populate('applicantId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.applicantId._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this application' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Withdraw application
// @route   DELETE /applications/:id
// @access  Private (Job Seeker)
const withdrawApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.applicantId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to withdraw this application' });
        }

        if (application.status !== 'PENDING') {
            return res.status(400).json({ message: 'Cannot withdraw processed application' });
        }

        await application.deleteOne();
        res.json({ message: 'Application withdrawn' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for employer's jobs
// @route   GET /employer/applications
// @access  Private (Employer)
const getEmployerApplications = async (req, res) => {
    try {
        const { status } = req.query;
        const jobs = await Job.find({ employerId: req.user._id });
        const jobIds = jobs.map((job) => job._id);

        const query = { jobId: { $in: jobIds } };
        if (status && ['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
            query.status = status;
        }

        const applications = await Application.find(query)
            .populate('jobId', 'title')
            .populate('applicantId', 'name email');

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept or reject application
// @route   PUT /employer/applications/:id
// @access  Private (Employer)
const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const application = await Application.findById(req.params.id).populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.jobId.employerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this application' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Offer Letter PDF
// @route   GET /applications/:id/offer
// @access  Private (Job Seeker)
const generateOfferLetter = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId')
            .populate('applicantId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.status !== 'ACCEPTED') {
            return res.status(400).json({ message: 'Application not accepted yet' });
        }

        if (application.applicantId._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const doc = new PDFDocument();
        const filename = `Offer_Letter_${application.applicantId.name}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(25).text('Offer Letter', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();
        doc.text(`Dear ${application.applicantId.name},`);
        doc.moveDown();
        doc.text(`We are pleased to offer you the position of ${application.jobId.title} at our company.`);
        doc.text(`Location: ${application.jobId.location}`);
        doc.text(`Employment Type: ${application.jobId.employmentType}`);
        doc.moveDown();
        doc.text('Congratulations!');
        doc.moveDown();

        // QR Code - links to job details page
        const jobDetailsUrl = `http://localhost:5173/jobs/${application.jobId._id}`;
        const qrCodeImage = await QRCode.toDataURL(jobDetailsUrl);
        doc.image(qrCodeImage, { fit: [100, 100], align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text('Scan QR code to view job details', { align: 'center' });

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getApplicationById,
    withdrawApplication,
    getEmployerApplications,
    updateApplicationStatus,
    generateOfferLetter,
};
