import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

function useToke() {
   let token =  window.sessionStorage.getItem('useToken')
   console.log(token)
   return token
}
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: '/api/V1'}),
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => ({
                url:'/Energy/EnergyFlowRunTime/QueryWater?projectId=2&type=1&date=2024-02-19',
                method: 'POST',
                body: [0, 2, 4, 8],
                headers: {
                    Token: useToke()
                }
            })
        }),
        getPost: builder.query({
            query: (id) => ({
                url:'/Energy/EnergyFlowRunTime/QueryWater?projectId=2&type=1&date=2024-02-19',
                method: 'POST',
                body: [id],
                headers: {
                    Token: useToke()
                }
            })
        }),
        paramPost: builder.mutation({
            query: (id) => ({
                url:'/Energy/EnergyFlowRunTime/QueryWater?projectId=2&type=1&date=2024-02-19',
                method: 'POST',
                body: [id],
                headers: {
                    Token: useToke()
                }
            })
        })
    })
})
export const {useGetPostsQuery, useGetPostQuery, useParamPostMutation} = apiSlice