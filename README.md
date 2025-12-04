# Employment System

A full-stack job portal application with role-based access control for Admin, Employers, and Job Seekers.

## Features

- **Three User Roles**: Admin, Employer, Job Seeker
- **JWT Authentication**: Secure token-based authentication
- **Job Management**: Create, update, delete, and search jobs
- **Application System**: Apply, withdraw, accept/reject applications
- **Offer Letters**: Generate PDF offer letters with QR codes
- **Search & Filters**: Debounced search by title, location, and employment type
- **Responsive UI**: Modern, attractive interface with Tailwind CSS

## Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- Joi for validation
- PDFKit & QRCode for offer letters

**Frontend:**
- React.js with Vite
- Redux Toolkit & RTK Query
- React Router
- Tailwind CSS

## Quick Setup

### Prerequisites
- Node.js (v14+)
- MongoDB

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 2. Configure Environment

Create `backend/.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/employment-system
JWT_SECRET=your_secret_key_here
```

### 3. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This creates test accounts:
- **Admin**: admin@test.com / 123456
- **Employer**: hr@techcorp.com / 123456
- **Job Seeker**: john@test.com / 123456

### 4. Start Servers

```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

**Access:** http://localhost:5173

## API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Jobs
- `GET /jobs` - Get all jobs (with filters)
- `GET /jobs/:id` - Get job details
- `POST /jobs` - Create job (Employer)
- `PUT /jobs/:id` - Update job (Employer)
- `DELETE /jobs/:id` - Delete job (Employer)

### Applications (Job Seeker)
- `POST /applications` - Apply for job
- `GET /applications` - Get my applications
- `GET /applications/:id` - Get application details
- `DELETE /applications/:id` - Withdraw application
- `GET /applications/:id/offer` - Download offer letter

### Employer
- `GET /employer/applications` - Get applications for my jobs
- `PUT /employer/applications/:id` - Accept/reject application

### Admin
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id/role` - Update user role
- `GET /admin/jobs` - Get all jobs
- `DELETE /admin/jobs/:id` - Delete any job
- `GET /admin/applications` - Get all applications
- `PUT /admin/applications/:id` - Update application status

## Testing with Postman

1. Import `postman_collection.json`
2. Set `baseUrl` to `http://localhost:5000`
3. Login and copy token to `token` variable
4. Test all endpoints

## Project Structure

```
employment-system/
├── backend/
│   ├── controllers/      # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Helper functions
│   ├── seed.js          # Dummy data script
│   └── index.js         # Entry point
├── frontend/
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── slices/      # Redux slices
│       └── store.js     # Redux store
├── postman_collection.json
└── README.md
```

## User Roles & Permissions

### Admin
- **No public registration** - Admin accounts created via seed data only
- View all users, jobs, and applications
- Change user roles (admin/employer/job_seeker)
- Delete inappropriate jobs
- Update application status
- Filter users by role

### Employer
- Register and login
- Create, update, delete own jobs
- View applications for own jobs
- Accept/reject applications

### Job Seeker
- Register and login
- Browse and search jobs
- Apply for jobs
- View own applications
- Withdraw pending applications
- Download offer letters (accepted applications)

## Key Features

### 1. Debounced Search
Search waits 500ms after typing stops before making API call, reducing server load by 90%+.

### 2. Offer Letter Generation
Accepted applications can download PDF offer letters with:
- Job details
- Applicant information
- QR code linking to job details

### 3. Application Workflow
```
Apply → PENDING → Employer Reviews → ACCEPTED/REJECTED
         ↓
    Can Withdraw
```

### 4. Input Validation
All inputs validated using Joi:
- Email format
- Password strength (min 6 chars)
- Required fields
- Valid enum values

## Seed Data

Run `npm run seed` in backend to create:
- 13 users (1 admin, 4 employers, 8 job seekers)
- 22 jobs across different companies
- 24-40 applications with various statuses

**Commands:**
```bash
npm run seed          # Create dummy data
npm run seed:destroy  # Clear all data
```

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGO_URI in .env

**Port Already in Use:**
- Change PORT in .env
- Or kill process using port 5000

**Authentication Issues:**
- Clear browser localStorage
- Login again to get new token

**Offer Letter Not Downloading:**
- Ensure application status is ACCEPTED
- Check browser console for errors

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected API routes
- Input validation on all endpoints

## Development

```bash
# Backend with auto-reload
cd backend
npm run dev

# Frontend with hot reload
cd frontend
npm run dev
```

## Production Deployment

1. Set strong JWT_SECRET
2. Use MongoDB Atlas for database
3. Enable HTTPS
4. Set NODE_ENV=production
5. Build frontend: `npm run build`
6. Serve static files from backend

## License

ISC

## Support

For issues or questions, check:
- API documentation in Postman collection
- Code comments in source files
- MongoDB logs for database issues

---
