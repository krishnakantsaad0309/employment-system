import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import JobForm from './pages/JobForm';
import ApplicationList from './pages/ApplicationList';
import EmployerApplications from './pages/EmployerApplications';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="" element={<PrivateRoute />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/jobs" element={<JobList />} />
                        <Route path="/jobs/:id" element={<JobDetail />} />
                        <Route path="/create-job" element={<JobForm />} />
                        <Route path="/applications" element={<ApplicationList />} />
                        <Route path="/employer/applications" element={<EmployerApplications />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                </Routes>
                <ToastContainer />
            </div>
        </Router>
    );
};

export default App;
