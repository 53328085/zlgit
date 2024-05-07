import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

function useToke() {
   let token =  window.sessionStorage.getItem('useToken')
   return token
}
export const apiSlice = createApi({
    reducerPath: 'NESapi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/V1', prepareHeaders: (headers, api) => {
      console.log(api);
      headers.set('Token', useToke())
      return headers;
    }}),
    tagTypes: ['energy'],
    endpoints: build => ({
        getPosts: build.query({
            query: (lng) => ({
                url:`/Energy/EnergyFlowRunTime/QueryElectric?projectId=3&type=1&date=2024-04-29&culture=${lng}`,
                method: 'POST',
                body: [0,1],
            }),
            providesTags:["energy"],
            transformResponse: resp => {
                console.dir(resp);
                return resp;
            }
           /*  providesTags:  (result=[], error, arg) => {
              let {link} = result
               console.log(error)
               console.log(arg)
               return ['energy', ...link.map(({id})=> ({type: 'energy', id}))]
            } */
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
            }),
            invalidatesTags: ["energy"]
        })
    }),


})
console.dir(apiSlice)
export const {useGetPostsQuery, useGetPostQuery, useParamPostMutation} = apiSlice