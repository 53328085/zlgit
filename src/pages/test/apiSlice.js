import {apiTest} from './apiBasic'
console.dir(apiTest);
export const apiSlice = apiTest.injectEndpoints({
    endpoints: build => ({
        getPosts: build.query({
            query: () => ({
                url:'/Energy/EnergyFlowRunTime/QueryWater?projectId=2&type=1&date=2024-02-19',
                method: 'POST',
                body: [0, 2, 4, 8],
            })
        }),
        getPost: build.query({
            query: (id) => ({
                url:'/Energy/EnergyFlowRunTime/QueryWater?projectId=2&type=1&date=2024-02-19',
                method: 'POST',
                body: [id],
            })
        }),
        paramPost: build.mutation({
            query: (id) => ({
                url:'/Energy/EnergyFlowRunTime/QueryWater?projectId=2&type=1&date=2024-02-19',
                method: 'POST',
                body: [id],
            })
        })
    }),
    
})
export const {useGetPostsQuery, useGetPostQuery, useParamPostMutation} = apiSlice
export const selectUsersResult = apiSlice.endpoints.getPost.select()