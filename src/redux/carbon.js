import { apiSlice } from "./rtkquery"
 
export const carbonSlice = apiSlice.injectEndpoints({   
       
    endpoints: build => ({
        // 设计态        
        // 企业设置
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
        CalcFactor: build.query({ // 获取企业计算因子
            query: (enterpriseId) => ({
                url: `Carbon/CarbonEmissionCalculationFactor/QueryCarbonEmissionCalculationFactor?enterpriseId=${enterpriseId}`,
                method: 'GET', 
            }), 
            transformErrorResponse: (response, meta, arg) => {
                 console.log(response)
                return  response.status
            },
            providesTags: () => [{type: "carbon", id: 'QueryCarbonEmissionCalculationFactor'}]
        }),
        
        FactorList: build.query({ // 获取企业计算因子列表
            query: ({enterpriseId,categoryNo}) => ({
                url: `Carbon/CarbonEmissionCalculationFactor/QueryAddCarbonCalculationFactor?enterpriseId=${enterpriseId}&categoryNo=${categoryNo}`,
                method: 'GET', 
            }), 
            transformResponse: (response, meta, arg) => response.data,
        }),

        AddFactor: build.mutation({  //添加企业计算因子
            query: (body) => ({
                url:'Carbon/CarbonEmissionCalculationFactor/AddCarbonEmissionCalculationFactor',
                method: 'POST',
                body,
            }),
           invalidatesTags: () => [{type: "carbon", id: `QueryCarbonEmissionCalculationFactor`}]
        }),

        SaveCalculationFactorValue: build.mutation({  //保存企业计算因子
            query: (body) => ({
                url:'Carbon/CarbonEmissionCalculationFactor/SaveCarbonEmissionCalculationFactorValue',
                method: 'POST',
                body,
            }),
           invalidatesTags: () => [{type: "carbon", id: 'QueryCarbonEmissionCalculationFactor'}]
        }),
        
        DeleteCalculationFactor: build.mutation({  //删除企业计算因子
            query: (id) => ({
                url:`Carbon/CarbonEmissionCalculationFactor/DeleteCarbonEmissionCalculationFactor?id=${id}`,
                method: 'DELETE',
            }),
           invalidatesTags: () => [{type: "carbon", id: 'QueryCarbonEmissionCalculationFactor'}]
        }),
        // 园区图片 
        updateImg: build.mutation({  // 上传园区图片
            query: ({body, projectId}) => ({
                url:`Carbon/CarbonParkImage/PostParkImage?projectId=${projectId}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: () => [{type: "carbon", id: 'UploadParkImage'}]
        }),
      
        // 运行态******
        // 碳排概述

        ProjectPhoto: build.query({   // 获取园区图片
            query: (projectId) => ({
                url:`Carbon/CarbonOverviewRuntime/QueryProjectPhoto?projectId=${projectId}`,
                method: "GET",
            }),
            transformResponse: responseData => responseData.data,
            providesTags: () => [{type: "carbon", id: 'UploadParkImage'}]
        }),
          
        Overview: build.query({   // 获取碳排概述
            query: (enterpriseId) => ({
                url:`Carbon/CarbonOverviewRuntime/QueryCarbonOverview?enterpriseId=${enterpriseId}`,
                method: "GET",
                transformResponse: responseData => responseData?.data?.data || {}
            }),
        }),  
        RealTime: build.query({   // 获取实时碳排放
            query: ({enterpriseId, type}) => {
                let T= type ?? 1
                return ({
                url:`Carbon/CarbonOverviewRuntime/QueryRealTimeCarbonEmission?enterpriseId=${enterpriseId}&type=${T}`,
                method: "GET",
               
            })},
        }),  
        Ranking: build.query({   // 获取碳排排名
            query: ({enterpriseId, type}) =>({
                url:`Carbon/CarbonOverviewRuntime/QueryCarbonEmissionRanking?enterpriseId=${enterpriseId}&type=${type}`,
                method: "GET",
                transformResponse: (response, meta, arg) => response.data,
            }),
        }),    
        Month: build.query({   // 获取月度碳排
            query: ({enterpriseId, type}) =>({
                url:`Carbon/CarbonOverviewRuntime/QueryCarbonEmission?enterpriseId=${enterpriseId}&type=${type}`,
                method: "GET",
               
            }),
        }),  
        Ratio: build.query({   // 获取碳排占比
            query: ({enterpriseId, type=1}) =>({
                url:`Carbon/CarbonOverviewRuntime/QueryCarbonEmissionRatio?enterpriseId=${enterpriseId}&type=${type}`,
                method: "GET",
                transformResponse: (response, meta, arg) => response.data,
            }),
        }), 
        Energy: build.query({   // 分类能耗
            query: ({enterpriseId, type=1}) =>({
                url:`Carbon/CarbonOverviewRuntime/QueryClassifiedEnergyConsumption?enterpriseId=${enterpriseId}&type=${type}`,
                method: "GET",
               
            }),
        }), 
        
      //  碳排考核跟踪

      Annual: build.query({    
        query: ({enterpriseId, year}) =>({
            url:`Carbon/CarbonTrackRuntime/QueryAnnualData?enterpriseId=${enterpriseId}&year=${year}`, //  碳排年度数据
            method: "GET",
            transformResponse: (response, meta, arg) => response.data,
        }),
      }), 
      
      Analysis: build.query({    
        query: ({enterpriseId, year}) =>({
            url:`Carbon/CarbonTrackRuntime/QueryMonthlyAnalysis?enterpriseId=${enterpriseId}&year=${year}`, //  碳排月度考核分析
            method: "GET",
            transformResponse: (response, meta, arg) => response.data,
        }),
      }), 
      EmissionData: build.query({    
        query: ({enterpriseId, year}) =>({
            url:`Carbon/CarbonTrackRuntime/QueryEmissionData?enterpriseId=${enterpriseId}&year=${year}`, //  碳排放数据
            method: "GET",
            transformResponse: (response, meta, arg) => response.data,
        }),
      }), 
     
    }),
 


})
console.log(carbonSlice)
export const {
    useIndustryListQuery,
     useSubIndustryListQuery, 
     useProvinceListQuery, 
     useNatureListQuery, 
     useEnterpriseQuery,
     useEmissionItemsQuery,
     useSaveEnterpriseMutation,
     useSaveItemsMutation,
     useOverviewQuery,
     useProjectPhotoQuery,
     useRealTimeQuery,
     useRankingQuery,
     useMonthQuery,
     useRatioQuery,
     useEnergyQuery,
     useUpdateImgMutation,
     useAnnualQuery,
     useAnalysisQuery,
     useEmissionDataQuery,
     useCalcFactorQuery,
     useSaveCalculationFactorValueMutation,
     useDeleteCalculationFactorMutation,
     useFactorListQuery,
     useAddFactorMutation,

    } = carbonSlice