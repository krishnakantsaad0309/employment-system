import React, { useState, useEffect } from 'react';
import { useGetJobsQuery } from '../slices/jobsApiSlice';
import { Link, useNavigate } from 'react-router-dom';

const JobList = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ title: '', location: '', employmentType: '' });
    const [debouncedFilters, setDebouncedFilters] = useState({ title: '', location: '', employmentType: '' });
    const { data: jobs, isLoading, error } = useGetJobsQuery(debouncedFilters);

    // Debounce effect - wait 500ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);

        // Cleanup function - cancel the timer if user types again
        return () => clearTimeout(timer);
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Check if user is still typing
    const isTyping = JSON.stringify(filters) !== JSON.stringify(debouncedFilters);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
                    <p className="text-gray-600">Discover opportunities that match your skills and interests</p>
                </div>

                {/* Search Filters */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Software Engineer"
                                    value={filters.title}
                                    onChange={handleFilterChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="e.g. Remote, New York"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                            <select
                                name="employmentType"
                                value={filters.employmentType}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                    </div>
                    {isTyping && (
                        <div className="mt-4 flex items-center text-blue-600 text-sm">
                            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Searching...
                        </div>
                    )}
                </div>

                {/* Results */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-gray-600">Loading jobs...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 font-medium">Error loading jobs</p>
                    </div>
                ) : jobs && jobs.length > 0 ? (
                    <div>
                        <p className="text-gray-600 mb-4">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>
                        <div className="grid gap-6">
                            {jobs.map((job) => (
                                <div key={job._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                                            <p className="text-gray-600 font-medium mb-3">{job.employerId?.name}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {job.location}
                                                </span>
                                                <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    {job.employmentType}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link 
                                        to={`/jobs/${job._id}`} 
                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                    >
                                        View Details
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-600">Try adjusting your search filters to find more opportunities</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobList;
