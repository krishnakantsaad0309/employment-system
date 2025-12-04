import { apiSlice } from './apiSlice';

export const applicationsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        applyForJob: builder.mutation({
            query: (data) => ({
                url: '/applications',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Application'],
        }),
        getMyApplications: builder.query({
            query: () => '/applications',
            providesTags: ['Application'],
        }),
        getApplicationById: builder.query({
            query: (id) => `/applications/${id}`,
            providesTags: ['Application'],
        }),
        withdrawApplication: builder.mutation({
            query: (id) => ({
                url: `/applications/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Application'],
        }),
        getEmployerApplications: builder.query({
            query: () => '/employer/applications',
            providesTags: ['Application'],
        }),
        updateApplicationStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/employer/applications/${id}`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Application'],
        }),
    }),
});

export const {
    useApplyForJobMutation,
    useGetMyApplicationsQuery,
    useGetApplicationByIdQuery,
    useWithdrawApplicationMutation,
    useGetEmployerApplicationsQuery,
    useUpdateApplicationStatusMutation,
} = applicationsApiSlice;
