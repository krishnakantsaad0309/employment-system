const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

// Sample data
const users = [
    // Admin
    {
        name: 'Admin User',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin',
    },
    // Employers
    {
        name: 'Tech Corp HR',
        email: 'hr@techcorp.com',
        password: '123456',
        role: 'employer',
    },
    {
        name: 'StartUp Inc',
        email: 'jobs@startup.com',
        password: '123456',
        role: 'employer',
    },
    {
        name: 'Global Solutions',
        email: 'careers@global.com',
        password: '123456',
        role: 'employer',
    },
    {
        name: 'Innovation Labs',
        email: 'hiring@innovation.com',
        password: '123456',
        role: 'employer',
    },
    // Job Seekers
    {
        name: 'John Doe',
        email: 'john@test.com',
        password: '123456',
        role: 'job_seeker',
    },
    {
        name: 'Jane Smith',
        email: 'jane@test.com',
        password: '123456',
        role: 'job_seeker',
    },
    {
        name: 'Mike Johnson',
        email: 'mike@test.com',
        password: '123456',
        role: 'job_seeker',
    },
    {
        name: 'Sarah Williams',
        email: 'sarah@test.com',
        password: '123456',
        role: 'job_seeker',
    },
    {
        name: 'David Brown',
        email: 'david@test.com',
        password: '123456',
        role: 'job_seeker',
    },
    {
        name: 'Emily Davis',
        email: 'emily@test.com',
        password: '123456',
        role: 'job_seeker',
    },
    {
        name: 'Robert Miller',
        email: 'robert@test.com',
        password: '123456',
        role: 'job_seeker',
    },
    {
        name: 'Lisa Anderson',
        email: 'lisa@test.com',
        password: '123456',
        role: 'job_seeker',
    },
];

const jobs = [
    // Tech Corp Jobs
    {
        title: 'Senior Software Engineer',
        description: 'We are looking for an experienced software engineer with 5+ years of experience in full-stack development. Must have expertise in React, Node.js, and MongoDB.',
        location: 'San Francisco, CA',
        employmentType: 'Full-time',
        employerIndex: 1,
        daysAgo: 2,
    },
    {
        title: 'Frontend Developer',
        description: 'Join our team as a Frontend Developer. Experience with React, TypeScript, and modern CSS frameworks required.',
        location: 'Remote',
        employmentType: 'Full-time',
        employerIndex: 1,
        daysAgo: 5,
    },
    {
        title: 'DevOps Engineer',
        description: 'Looking for a DevOps engineer with experience in AWS, Docker, Kubernetes, and CI/CD pipelines.',
        location: 'New York, NY',
        employmentType: 'Full-time',
        employerIndex: 1,
        daysAgo: 10,
    },
    // StartUp Inc Jobs
    {
        title: 'Full Stack Developer',
        description: 'Exciting opportunity at a fast-growing startup. Work with cutting-edge technologies and build innovative products.',
        location: 'Austin, TX',
        employmentType: 'Full-time',
        employerIndex: 2,
        daysAgo: 1,
    },
    {
        title: 'UI/UX Designer',
        description: 'Creative UI/UX designer needed to design beautiful and intuitive user interfaces. Portfolio required.',
        location: 'Remote',
        employmentType: 'Full-time',
        employerIndex: 2,
        daysAgo: 3,
    },
    {
        title: 'Marketing Intern',
        description: 'Summer internship opportunity for marketing students. Learn digital marketing, social media, and content creation.',
        location: 'Boston, MA',
        employmentType: 'Internship',
        employerIndex: 2,
        daysAgo: 7,
    },
    {
        title: 'Product Manager',
        description: 'Lead product development from conception to launch. 3+ years of product management experience required.',
        location: 'Seattle, WA',
        employmentType: 'Full-time',
        employerIndex: 2,
        daysAgo: 15,
    },
    // Global Solutions Jobs
    {
        title: 'Data Scientist',
        description: 'Analyze large datasets and build machine learning models. PhD or Masters in Computer Science, Statistics, or related field preferred.',
        location: 'Chicago, IL',
        employmentType: 'Full-time',
        employerIndex: 3,
        daysAgo: 4,
    },
    {
        title: 'Backend Developer',
        description: 'Build scalable backend systems using Node.js, Python, or Java. Experience with microservices architecture is a plus.',
        location: 'Remote',
        employmentType: 'Full-time',
        employerIndex: 3,
        daysAgo: 6,
    },
    {
        title: 'QA Engineer',
        description: 'Ensure quality of our products through manual and automated testing. Experience with Selenium, Jest, or Cypress required.',
        location: 'Denver, CO',
        employmentType: 'Full-time',
        employerIndex: 3,
        daysAgo: 8,
    },
    {
        title: 'Mobile Developer',
        description: 'Develop native mobile applications for iOS and Android. Experience with React Native or Flutter is a plus.',
        location: 'Los Angeles, CA',
        employmentType: 'Full-time',
        employerIndex: 3,
        daysAgo: 12,
    },
    {
        title: 'Business Analyst',
        description: 'Bridge the gap between business and technology. Gather requirements, create documentation, and work with stakeholders.',
        location: 'Miami, FL',
        employmentType: 'Full-time',
        employerIndex: 3,
        daysAgo: 20,
    },
    // Innovation Labs Jobs
    {
        title: 'Machine Learning Engineer',
        description: 'Build and deploy ML models at scale. Experience with TensorFlow, PyTorch, and cloud platforms required.',
        location: 'San Jose, CA',
        employmentType: 'Full-time',
        employerIndex: 4,
        daysAgo: 1,
    },
    {
        title: 'Cloud Architect',
        description: 'Design and implement cloud infrastructure solutions. AWS or Azure certification required.',
        location: 'Remote',
        employmentType: 'Full-time',
        employerIndex: 4,
        daysAgo: 5,
    },
    {
        title: 'Security Engineer',
        description: 'Protect our systems and data. Experience with penetration testing, security audits, and compliance required.',
        location: 'Washington, DC',
        employmentType: 'Full-time',
        employerIndex: 4,
        daysAgo: 9,
    },
    {
        title: 'Technical Writer',
        description: 'Create clear and concise technical documentation. Experience with API documentation and developer guides preferred.',
        location: 'Remote',
        employmentType: 'Part-time',
        employerIndex: 4,
        daysAgo: 11,
    },
    {
        title: 'Sales Engineer',
        description: 'Combine technical expertise with sales skills. Help customers understand and implement our solutions.',
        location: 'Atlanta, GA',
        employmentType: 'Full-time',
        employerIndex: 4,
        daysAgo: 14,
    },
    {
        title: 'Scrum Master',
        description: 'Facilitate agile development processes. CSM certification and 2+ years of experience required.',
        location: 'Portland, OR',
        employmentType: 'Full-time',
        employerIndex: 4,
        daysAgo: 18,
    },
    {
        title: 'Database Administrator',
        description: 'Manage and optimize database systems. Experience with PostgreSQL, MySQL, and MongoDB required.',
        location: 'Phoenix, AZ',
        employmentType: 'Full-time',
        employerIndex: 4,
        daysAgo: 22,
    },
    {
        title: 'Content Writer Intern',
        description: 'Create engaging content for our blog and social media. Great opportunity for students or recent graduates.',
        location: 'Remote',
        employmentType: 'Internship',
        employerIndex: 4,
        daysAgo: 25,
    },
    {
        title: 'IT Support Specialist',
        description: 'Provide technical support to employees. Troubleshoot hardware and software issues.',
        location: 'Dallas, TX',
        employmentType: 'Full-time',
        employerIndex: 4,
        daysAgo: 28,
    },
    {
        title: 'Graphic Designer',
        description: 'Create visual content for marketing campaigns. Proficiency in Adobe Creative Suite required.',
        location: 'Remote',
        employmentType: 'Contract',
        employerIndex: 4,
        daysAgo: 30,
    },
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Job.deleteMany();
        await Application.deleteMany();

        console.log('Data Destroyed!');

        // Create users
        const createdUsers = await User.insertMany(users);
        console.log(`${createdUsers.length} users created!`);

        // Create jobs with different timestamps
        const jobsToCreate = jobs.map((job) => {
            const employer = createdUsers[job.employerIndex];
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - job.daysAgo);

            return {
                title: job.title,
                description: job.description,
                location: job.location,
                employmentType: job.employmentType,
                employerId: employer._id,
                createdAt: createdAt,
                updatedAt: createdAt,
            };
        });

        const createdJobs = await Job.insertMany(jobsToCreate);
        console.log(`${createdJobs.length} jobs created!`);

        // Create applications with different statuses and timestamps
        const applications = [];
        const jobSeekers = createdUsers.filter((u) => u.role === 'job_seeker');

        // Each job seeker applies to 3-5 random jobs
        jobSeekers.forEach((seeker, seekerIndex) => {
            const numApplications = 3 + Math.floor(Math.random() * 3); // 3-5 applications
            const appliedJobs = new Set();

            for (let i = 0; i < numApplications; i++) {
                let randomJob;
                do {
                    randomJob = createdJobs[Math.floor(Math.random() * createdJobs.length)];
                } while (appliedJobs.has(randomJob._id.toString()));

                appliedJobs.add(randomJob._id.toString());

                // Random status distribution
                const rand = Math.random();
                let status;
                if (rand < 0.5) status = 'PENDING'; // 50% pending
                else if (rand < 0.8) status = 'ACCEPTED'; // 30% accepted
                else status = 'REJECTED'; // 20% rejected

                // Application created 1-10 days after job posting
                const appCreatedAt = new Date(randomJob.createdAt);
                appCreatedAt.setDate(appCreatedAt.getDate() + Math.floor(Math.random() * 10) + 1);

                applications.push({
                    jobId: randomJob._id,
                    applicantId: seeker._id,
                    status: status,
                    createdAt: appCreatedAt,
                    updatedAt: appCreatedAt,
                });
            }
        });

        const createdApplications = await Application.insertMany(applications);
        console.log(`${createdApplications.length} applications created!`);

        console.log('\n=== SEED DATA SUMMARY ===');
        console.log(`Total Users: ${createdUsers.length}`);
        console.log(`  - Admins: 1`);
        console.log(`  - Employers: 4`);
        console.log(`  - Job Seekers: ${jobSeekers.length}`);
        console.log(`Total Jobs: ${createdJobs.length}`);
        console.log(`Total Applications: ${createdApplications.length}`);
        console.log(`  - Pending: ${createdApplications.filter(a => a.status === 'PENDING').length}`);
        console.log(`  - Accepted: ${createdApplications.filter(a => a.status === 'ACCEPTED').length}`);
        console.log(`  - Rejected: ${createdApplications.filter(a => a.status === 'REJECTED').length}`);

        console.log('\n=== TEST ACCOUNTS ===');
        console.log('Admin:');
        console.log('  Email: admin@test.com');
        console.log('  Password: 123456');
        console.log('\nEmployers:');
        console.log('  Email: hr@techcorp.com | Password: 123456');
        console.log('  Email: jobs@startup.com | Password: 123456');
        console.log('  Email: careers@global.com | Password: 123456');
        console.log('  Email: hiring@innovation.com | Password: 123456');
        console.log('\nJob Seekers:');
        console.log('  Email: john@test.com | Password: 123456');
        console.log('  Email: jane@test.com | Password: 123456');
        console.log('  Email: mike@test.com | Password: 123456');
        console.log('  Email: sarah@test.com | Password: 123456');
        console.log('  Email: david@test.com | Password: 123456');
        console.log('  Email: emily@test.com | Password: 123456');
        console.log('  Email: robert@test.com | Password: 123456');
        console.log('  Email: lisa@test.com | Password: 123456');

        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Job.deleteMany();
        await Application.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error('Error destroying data:', error);
        process.exit(1);
    }
};

// Check command line arguments
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
