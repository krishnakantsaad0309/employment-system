import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobByIdQuery } from '../slices/jobsApiSlice';
import { useApplyForJobMutation } from '../slices/applicationsApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const { data: job, isLoading, error } = useGetJobByIdQuery(id);
    const [applyForJob, { isLoading: isApplying }] = useApplyForJobMutation();

    const handleApply = async () => {
        try {
            await applyForJob({ jobId: id }).unwrap();
            toast.success('Applied successfully!');
            navigate('/applications');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading...</div></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500"><div className="text-xl">Error loading job details</div></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {/* Job Card */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="border-b pb-6 mb-6">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">{job.title}</h1>
                        <div className="flex items-center text-gray-600 mb-4">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="font-semibold">{job.employerId?.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location}
                            </span>
                            <span className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {job.employmentType}
                            </span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Job Description
                        </h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{job.description}</p>
                    </div>

                    {userInfo && userInfo.role === 'job_seeker' && (
                        <div className="flex gap-4">
                            <button
                                onClick={handleApply}
                                disabled={isApplying}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isApplying ? 'Applying...' : 'Apply Now'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
