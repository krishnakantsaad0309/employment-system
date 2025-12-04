import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../slices/authSlice';

const Dashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {userInfo.name} ({userInfo.role})</span>
                    <button
                        onClick={logoutHandler}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main>
                {userInfo.role === 'admin' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/admin" className="bg-white p-4 rounded shadow hover:bg-gray-50 block">
                                <h3 className="font-bold">Go to Admin Dashboard</h3>
                                <p>Manage Users, Jobs, and Applications</p>
                            </Link>
                        </div>
                    </div>
                )}

                {userInfo.role === 'employer' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Employer Panel</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link to="/create-job" className="bg-white p-4 rounded shadow hover:bg-gray-50 block">
                                <h3 className="font-bold">Post a Job</h3>
                                <p>Create a new job listing</p>
                            </Link>
                            <Link to="/employer/applications" className="bg-white p-4 rounded shadow hover:bg-gray-50 block">
                                <h3 className="font-bold">View Applications</h3>
                                <p>Manage applications for your jobs</p>
                            </Link>
                        </div>
                    </div>
                )}

                {userInfo.role === 'job_seeker' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Job Seeker Panel</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link to="/jobs" className="bg-white p-4 rounded shadow hover:bg-gray-50 block">
                                <h3 className="font-bold">Search Jobs</h3>
                                <p>Find and apply for jobs</p>
                            </Link>
                            <Link to="/applications" className="bg-white p-4 rounded shadow hover:bg-gray-50 block">
                                <h3 className="font-bold">My Applications</h3>
                                <p>View status of your applications</p>
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
