import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
function useToke() {
   let token =  window.sessionStorage.getItem('useToken')
   return token
}
export const apiSlice = createApi({
    reducerPath: 'NESapi',
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({baseUrl: '/api/V1', prepareHeaders: (headers, api) => {     
      headers.set('Token', useToke())
      headers.set('content-type', 'application/json')
      return headers;
    }}),
    tagTypes: ['updateE', 'boundary'],  
    endpoints: build => ({
       
        
    })
 

})
/* export const {
    useIndustryListQuery,
     useSubIndustryListQuery, 
     useProvinceListQuery, 
     useNatureListQuery, 
     useEnterpriseQuery,
     useEmissionItemsQuery,
     useSaveEnterpriseMutation,
     useSaveItemsMutation,
    } = apiSlice */