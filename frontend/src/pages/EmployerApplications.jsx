import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetEmployerApplicationsQuery, useUpdateApplicationStatusMutation } from '../slices/applicationsApiSlice';
import { toast } from 'react-toastify';

const EmployerApplications = () => {
    const navigate = useNavigate();
    const { data: applications, isLoading, error } = useGetEmployerApplicationsQuery();
    const [updateStatus] = useUpdateApplicationStatusMutation();

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateStatus({ id, status }).unwrap();
            toast.success(`Application ${status.toLowerCase()}`);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading...</div></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500"><div className="text-xl">Error loading applications</div></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center text-gray-700 hover:text-gray-900 font-medium"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Applications</h1>
                    <p className="text-gray-600">Manage applications for your job postings</p>
                </div>

                {applications && applications.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications.map((app) => (
                                        <tr key={app._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{app.applicantId?.name}</div>
                                                <div className="text-sm text-gray-500">{app.applicantId?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{app.jobId?.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {app.status === 'PENDING' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(app._id, 'ACCEPTED')}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(app._id, 'REJECTED')}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-600">Applications will appear here when candidates apply to your jobs</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerApplications;
