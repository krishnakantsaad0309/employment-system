const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    employmentType: {
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    },
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
