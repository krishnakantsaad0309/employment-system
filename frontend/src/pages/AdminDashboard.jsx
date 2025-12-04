import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    useGetUsersQuery, 
    useUpdateUserRoleMutation,
    useGetAllJobsQuery, 
    useDeleteJobByAdminMutation, 
    useGetAllApplicationsQuery,
    useUpdateApplicationStatusByAdminMutation 
} from '../slices/adminApiSlice';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [editingUser, setEditingUser] = useState(null);
    const [editingApp, setEditingApp] = useState(null);

    const { data: users, isLoading: loadingUsers } = useGetUsersQuery();
    const { data: jobs, isLoading: loadingJobs } = useGetAllJobsQuery();
    const { data: applications, isLoading: loadingApps } = useGetAllApplicationsQuery();
    
    const [deleteJob] = useDeleteJobByAdminMutation();
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [updateAppStatus] = useUpdateApplicationStatusByAdminMutation();

    const handleDeleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await deleteJob(id).unwrap();
                toast.success('Job deleted');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            await updateUserRole({ id: userId, role: newRole }).unwrap();
            toast.success('User role updated');
            setEditingUser(null);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleUpdateAppStatus = async (appId, newStatus) => {
        try {
            await updateAppStatus({ id: appId, status: newStatus }).unwrap();
            toast.success('Application status updated');
            setEditingApp(null);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage users, jobs, and applications</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-lg mb-6">
                    <div className="flex border-b">
                        <button
                            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                                activeTab === 'users' 
                                    ? 'border-b-4 border-purple-600 text-purple-600 bg-purple-50' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab('users')}
                        >
                            <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Users ({users?.length || 0})
                            </div>
                        </button>
                        <button
                            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                                activeTab === 'jobs' 
                                    ? 'border-b-4 border-purple-600 text-purple-600 bg-purple-50' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab('jobs')}
                        >
                            <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Jobs ({jobs?.length || 0})
                            </div>
                        </button>
                        <button
                            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                                activeTab === 'applications' 
                                    ? 'border-b-4 border-purple-600 text-purple-600 bg-purple-50' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab('applications')}
                        >
                            <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Applications ({applications?.length || 0})
                            </div>
                        </button>
                    </div>
                </div>

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600">
                            <h2 className="text-2xl font-bold text-white">User Management</h2>
                            <p className="text-purple-100">Manage user roles and permissions</p>
                        </div>
                        {loadingUsers ? (
                            <div className="p-12 text-center">Loading...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users?.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingUser === user._id ? (
                                                        <select
                                                            defaultValue={user.role}
                                                            onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                                                            className="border rounded px-3 py-1 text-sm"
                                                        >
                                                            <option value="admin">Admin</option>
                                                            <option value="employer">Employer</option>
                                                            <option value="job_seeker">Job Seeker</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                            user.role === 'employer' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {editingUser === user._id ? (
                                                        <button
                                                            onClick={() => setEditingUser(null)}
                                                            className="text-gray-600 hover:text-gray-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setEditingUser(user._id)}
                                                            className="text-purple-600 hover:text-purple-900 font-medium"
                                                        >
                                                            Change Role
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Jobs Tab */}
                {activeTab === 'jobs' && (
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600">
                            <h2 className="text-2xl font-bold text-white">Job Management</h2>
                            <p className="text-purple-100">View and manage all job postings</p>
                        </div>
                        {loadingJobs ? (
                            <div className="p-12 text-center">Loading...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Employer</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {jobs?.map((job) => (
                                            <tr key={job._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{job.employerId?.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{job.location}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                        {job.employmentType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            to={`/jobs/${job._id}`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteJob(job._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600">
                            <h2 className="text-2xl font-bold text-white">Application Management</h2>
                            <p className="text-purple-100">Monitor and manage all job applications</p>
                        </div>
                        {loadingApps ? (
                            <div className="p-12 text-center">Loading...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {applications?.map((app) => (
                                            <tr key={app._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{app.applicantId?.name}</div>
                                                    <div className="text-sm text-gray-500">{app.applicantId?.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{app.jobId?.title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingApp === app._id ? (
                                                        <select
                                                            defaultValue={app.status}
                                                            onChange={(e) => handleUpdateAppStatus(app._id, e.target.value)}
                                                            className="border rounded px-3 py-1 text-sm"
                                                        >
                                                            <option value="PENDING">PENDING</option>
                                                            <option value="ACCEPTED">ACCEPTED</option>
                                                            <option value="REJECTED">REJECTED</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                                            app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {app.status}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {editingApp === app._id ? (
                                                        <button
                                                            onClick={() => setEditingApp(null)}
                                                            className="text-gray-600 hover:text-gray-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setEditingApp(app._id)}
                                                            className="text-purple-600 hover:text-purple-900 font-medium"
                                                        >
                                                            Change Status
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
