import { apiSlice } from "./rtkquery"
 
export const carbonSlice = apiSlice.injectEndpoints({   
       
    endpoints: build => ({
        industryList: build.query({   // 获取碳排行业列表
            query: () => ({
                url:'/Carbon/CarbonEnterpriseSetting/QueryCarbonIndustryList',
                method: "GET",
            }),
            transformResponse: responseData => responseData
        }),
        subIndustryList: build.query({ // 获取碳排二级行业列表
            query: (id) => ({
                url: `/Carbon/CarbonEnterpriseSetting/QueryCarbonSubIndustryList?industryNo=${id}`,
                method: 'GET',
                keepUnusedDataFor:5,
                
            })
        }),
        provinceList: build.query({ // 获取省份列表
            query: () => ({
                url: `/Carbon/CarbonEnterpriseSetting/QueryProvinceList`,
                method: 'GET',
            }),
            transformResponse: responseData => responseData
        }),
        natureList: build.query({ // 获取企业性质列表
            query: () => ({
                url: `/Carbon/CarbonEnterpriseSetting/QueryNatureList`,
                method: 'GET',
            }),
            transformResponse: responseData => responseData
        }),
        enterprise: build.query({ // 获取碳排企业信息
            query: (projectId) => ({
                url: `/Carbon/CarbonEnterpriseSetting/QueryCarbonEnterprise?projectId=${projectId}`,
                method: 'GET',
            }),
            transformResponse: responseData => responseData,
            providesTags: ['updateE']
        }),
        emissionItems: build.query({ // 获取企业碳排项信息
            query: (enterpriseId) => ({
                url: `Carbon/CarbonEnterpriseSetting/QueryCarbonEnterpriseEmissionItems?enterpriseId=${enterpriseId}`,
                method: 'GET',
            }),
            
        }),
        saveEnterprise: build.mutation({ // 保存碳排企业信息
            query: (body) => ({
                url: `/Carbon/CarbonEnterpriseSetting/SaveEnterprise`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['updateE']
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

export const {
    useIndustryListQuery,
     useSubIndustryListQuery, 
     useProvinceListQuery, 
     useNatureListQuery, 
     useEnterpriseQuery,
     useEmissionItemsQuery,
     useSaveEnterpriseMutation,
     useSaveItemsMutation,
    } = carbonSlice