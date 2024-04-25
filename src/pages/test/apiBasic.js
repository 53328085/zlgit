import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

function useToke() {
   let token =  window.sessionStorage.getItem('useToken')
   return token
}
export const api = createApi({
    reducerPath: 'NESapi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/V1', prepareHeaders: (headers, api) => {
      console.log(api);
      headers.set('Token', useToke())
      return headers;
    }}),
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
export const {useGetPostsQuery, useGetPostQuery, useParamPostMutation} = api