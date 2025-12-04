import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateJobMutation } from '../slices/jobsApiSlice';
import { toast } from 'react-toastify';

const JobForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [employmentType, setEmploymentType] = useState('Full-time');

    const navigate = useNavigate();
    const [createJob, { isLoading }] = useCreateJobMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createJob({ title, description, location, employmentType }).unwrap();
            toast.success('Job posted successfully');
            navigate('/');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto bg-white rounded shadow mt-10">
            <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
            <form onSubmit={submitHandler}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Job Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Employment Type</label>
                    <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                >
                    {isLoading ? 'Posting...' : 'Post Job'}
                </button>
            </form>
        </div>
    );
};

export default JobForm;
