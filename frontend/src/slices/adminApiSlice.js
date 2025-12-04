import { apiSlice } from './apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '/admin/users',
            providesTags: ['User'],
        }),
        updateUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `/admin/users/${id}/role`,
                method: 'PUT',
                body: { role },
            }),
            invalidatesTags: ['User'],
        }),
        getAllJobs: builder.query({
            query: () => '/admin/jobs',
            providesTags: ['Job'],
        }),
        deleteJobByAdmin: builder.mutation({
            query: (id) => ({
                url: `/admin/jobs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Job'],
        }),
        getAllApplications: builder.query({
            query: () => '/admin/applications',
            providesTags: ['Application'],
        }),
        updateApplicationStatusByAdmin: builder.mutation({
            query: ({ id, status }) => ({
                url: `/admin/applications/${id}`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Application'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useUpdateUserRoleMutation,
    useGetAllJobsQuery,
    useDeleteJobByAdminMutation,
    useGetAllApplicationsQuery,
    useUpdateApplicationStatusByAdminMutation,
} = adminApiSlice;
