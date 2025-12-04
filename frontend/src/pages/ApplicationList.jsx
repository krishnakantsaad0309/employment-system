import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetMyApplicationsQuery, useWithdrawApplicationMutation } from '../slices/applicationsApiSlice';
import { toast } from 'react-toastify';

const ApplicationList = () => {
    const { data: applications, isLoading, error } = useGetMyApplicationsQuery();
    const [withdrawApplication] = useWithdrawApplicationMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const handleWithdraw = async (id) => {
        if (window.confirm('Are you sure you want to withdraw this application?')) {
            try {
                await withdrawApplication(id).unwrap();
                toast.success('Application withdrawn');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const handleDownloadOffer = async (appId) => {
        try {
            const response = await fetch(`http://localhost:5000/applications/${appId}/offer`, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to download offer letter');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Offer_Letter_${appId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Offer letter downloaded');
        } catch (err) {
            toast.error('Failed to download offer letter');
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading...</div></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500"><div className="text-xl">Error loading applications</div></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
                    <p className="text-gray-600">Track the status of your job applications</p>
                </div>

                {applications && applications.length > 0 ? (
                    <div className="grid gap-6">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{app.jobId?.title}</h2>
                                <p className="text-gray-600 mb-3">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                                <div className="flex items-center mb-4">
                                    <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                                        app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 
                                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="flex gap-3">
                                    {app.status === 'PENDING' && (
                                        <button
                                            onClick={() => handleWithdraw(app._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                        >
                                            Withdraw
                                        </button>
                                    )}
                                    {app.status === 'ACCEPTED' && (
                                        <button
                                            onClick={() => handleDownloadOffer(app._id)}
                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                        >
                                            Download Offer Letter
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-600 mb-6">Start applying to jobs</p>
                        <Link to="/jobs" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg">
                            Browse Jobs
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationList;
