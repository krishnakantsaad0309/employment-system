import { apiSlice } from './apiSlice';

export const jobsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getJobs: builder.query({
            query: (params) => ({
                url: '/jobs',
                params,
            }),
            providesTags: ['Job'],
        }),
        getJobById: builder.query({
            query: (id) => `/jobs/${id}`,
            providesTags: ['Job'],
        }),
        createJob: builder.mutation({
            query: (data) => ({
                url: '/jobs',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Job'],
        }),
        updateJob: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/jobs/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Job'],
        }),
        deleteJob: builder.mutation({
            query: (id) => ({
                url: `/jobs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Job'],
        }),
    }),
});

export const {
    useGetJobsQuery,
    useGetJobByIdQuery,
    useCreateJobMutation,
    useUpdateJobMutation,
    useDeleteJobMutation,
} = jobsApiSlice;
