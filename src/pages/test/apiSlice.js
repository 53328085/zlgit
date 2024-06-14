import {apiTest} from './apiBasic'
console.dir(apiTest);
export const apiSlice = apiTest.injectEndpoints({
    endpoints: build => ({
        getPostse: build.query({
            query: () => ({
                url:'/Energy/EnergyFlowRunTime/QueryWater?projectId=2&type=1&date=2024-02-19',
                method: 'POST',
                body: [0, 2, 4, 8],
            })
        }),
        getPoste: build.query({
            query: (id) => ({
                url:'/Energy/EnergyFlowRunTime/QueryWater?projectId=2&type=1&date=2024-02-19',
                method: 'POST',
                body: [id],
            })
        }),
        paramPoste: build.mutation({
            query: (id) => ({
                url:'/Energy/EnergyFlowRunTime/QueryWater?projectId=2&type=1&date=2024-02-19',
                method: 'POST',
                body: [id],
            })
        }),
        getArea: build.query({
            query: (projectId) => ({
                url:`/General/Area/QueryAll?projectId=${projectId}&level=1`,
                method: 'GET',
                
            })
        }),
    }),
    
})
export const {useGetPostsQuery, useGetPostQuery, useParamPostMutation, useGetAreaQuery,} = apiSlice
export const selectUsersResult = apiSlice.endpoints.getPost.select()