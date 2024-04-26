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
    endpoints: build => ({
        industryList: build.query({   // 获取碳排行业列表
            query: () => ({
                url:'/Carbon/CarbonEnterpriseSetting/QueryCarbonIndustryList',
                method: "GET",
            })
        }),
        subIndustryList: build.query({ // 获取碳排二级行业列表
            query: (id) => ({
                url: `/Carbon/CarbonEnterpriseSetting/QueryCarbonSubIndustryList?industryNo=${id}`,
                method: 'GET',
                
            })
        }),
        provinceList: build.query({ // 获取省份列表
            query: () => ({
                url: `/Carbon/CarbonEnterpriseSetting/QueryProvinceList`,
                method: 'GET',
            })
        }),
        natureList: build.query({ // 获取企业性质列表
            query: () => ({
                url: `/Carbon/CarbonEnterpriseSetting/QueryNatureList`,
                method: 'GET',
            })
        }),
        enterprise: build.query({ // 获取碳排企业信息
            query: (projectId) => ({
                url: `/Carbon/CarbonEnterpriseSetting/QueryCarbonEnterprise?projectId=${projectId}`,
                method: 'GET',
            })
        }),
        emissionItems: build.query({ // 获取企业碳排项信息
            query: (enterpriseId) => ({
                url: `Carbon/CarbonEnterpriseSetting/QueryCarbonEnterpriseEmissionItems?enterpriseId=${enterpriseId}`,
                method: 'GET',
            })
        }),
        saveEnterprise: build.mutation({ // 保存碳排企业信息
            query: (body) => ({
                url: `/Carbon/CarbonEnterpriseSetting/SaveEnterprise`,
                method: 'POST',
                body,
            })
        }),
        saveItems: build.mutation({  //保存企业碳排项信息
            query: (body) => ({
                url:'/Carbon/CarbonEnterpriseSetting/SaveCarbonEnterpriseEmissionItems',
                method: 'POST',
                body,
            })
        }),
        
    }),


})
console.dir(apiSlice)
export const {
    useIndustryListQuery,
     useSubIndustryListQuery, 
     useProvinceListQuery, 
     useNatureListQuery, 
     useEnterpriseQuery,
     useEmissionItemsQuery,
     useSaveEnterpriseMutation,
     useSaveItemsMutation,
    } = apiSlice