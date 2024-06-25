import { apiSlice } from "./rtkquery"
 
export const carbonSlice = apiSlice.injectEndpoints({   
    overrideExisting: false,
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
            providesTags:  () => [{type: "carbon", id: "QueryCarbonEnterprise"}]
        }),
        emissionItems: build.query({ // 获取企业碳排项信息
            query: (enterpriseId) => ({
                url: `Carbon/CarbonEnterpriseSetting/QueryCarbonEnterpriseEmissionItems?enterpriseId=${enterpriseId}`,
                method: 'GET',
            }),
            providesTags: () => [{type: "carbon", id: "QueryCarbonEnterpriseEmissionItems"}]
        }),
        
        enableCarbon: build.mutation({ // 启用/禁用碳排项
            query: ({enterpriseId,categoryId,SubCategoryId,enabled}) => ({
                url: `Carbon/CarbonEnterpriseSetting/EnableCarbonEnterpriseEmissionItem?enterpriseId=${enterpriseId}&categoryId=${categoryId}&SubCategoryId=${SubCategoryId}&enabled=${enabled}`,
                method: 'POST',
            }),         
            invalidatesTags: (result, error, arg) =>  [{type: "carbon", id: "QueryCarbonEnterpriseEmissionItems"}]
        }),
        
        UpdateFactor: build.mutation({ // 修改碳排因子数值
            query: ({enterpriseId,categoryId,SubCategoryId,carbonEmissionFactor}) => ({
                url: ` Carbon/CarbonEnterpriseSetting/UpdateCarbonEmissionFactorValue?enterpriseId=${enterpriseId}&categoryId=${categoryId}&SubCategoryId=${SubCategoryId}&carbonEmissionFactor=${carbonEmissionFactor}`,
                method: 'POST',
            }),         
            invalidatesTags: (result, error, arg) =>  [{type: "carbon", id: "QueryCarbonEnterpriseEmissionItems"}]
        }),
         
        saveEnterprise: build.mutation({ // 保存碳排企业信息
            query: (body) => ({
                url: `/Carbon/CarbonEnterpriseSetting/SaveEnterprise`,
                method: 'POST',
                body,
            }),
            invalidatesTags: () => [{type: "carbon", id: "QueryCarbonEnterprise"}]
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

       // 边界
       BoundaryTree: build.query({   // 获取碳排边界树
        query: (enterpriseId=0) => ({
            url:`/Carbon/CarbonEmissionBoundary/QueryCarbonBoundary?enterpriseId=${enterpriseId}`,
            method: "GET",
        }),
       // transformResponse: responseData => responseData.post,
       providesTags: () =>[{type: 'carbon', id: 'QueryCarbonBoundary'}]
    }),
  
    AddCarbonBoundary: build.mutation({ // 新增边界子项
        query: (body) => ({
            url: `/Carbon/CarbonEmissionBoundary/AddCarbonBoundary`,
            method: 'POST',
            body,
        }),
        invalidatesTags: (result, error, arg) => [{type: 'carbon', id: 'QueryCarbonBoundary'}]
         
    }),
    updateBoundary: build.mutation({ // 更新边界子项名称
        query: ({id,name, enterpriseId}) => ({
            url: `Carbon/CarbonEmissionBoundary/UpadteCarbonBoundary?id=${id}&name=${name}&enterpriseId=${enterpriseId}`,
            method: 'POST',
        }),
        invalidatesTags: () => [{type: 'carbon', id: 'QueryCarbonBoundary'}],
         
    }),
   deleteBoundary: build.mutation({ // 删除子项
        query: (id) => ({
            url: `Carbon/CarbonEmissionBoundary/DeleteCarbonBoundary?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: () => [{type: 'carbon', id: 'QueryCarbonBoundary'}],
         
    }), 
    configData: build.query({ // 查询排放边界配置结构
        query: ({projectId,enterpriseId,carbonBoundaryId}) => ({
            url: `Carbon/CarbonEmissionBoundary/ConfigDataCarbonBoundary?projectId=${projectId}&enterpriseId=${enterpriseId}&carbonBoundaryId=${carbonBoundaryId}`,
            method: 'GET',
        }),
    }),
    DataConfig: build.query({ // 获取边界数据资源配置
        query: ({enterpriseId,carbonBoundaryId}) => ({
            url: `Carbon/CarbonEmissionBoundary/QueryCarbonBoundaryDataConfig?enterpriseId=${enterpriseId}&carbonBoundaryId=${carbonBoundaryId}`,
            method: 'GET',
        }),
        providesTags: (result, error, arg) => [{type: 'carbon', id: 'QueryCarbonBoundaryDataConfig'+arg.carbonBoundaryId+arg.subCategoryId}] // ['dataconfig']
    }),
     BoundaryConfig: build.query({ // 查询排放边界配置结构
        query: ({enterpriseId,carbonBoundaryId,subCategoryId,projectId}) => ({
            url: `Carbon/CarbonEmissionBoundary/QueryCarbonBoundaryConfig?enterpriseId=${enterpriseId}&carbonBoundaryId=${carbonBoundaryId}&projectId=${projectId}&subCategoryId=${subCategoryId}`,
            method: 'GET',
        }),
        providesTags:(result, error, arg) => [{type: "carbon", id: {
            type: 'QueryCarbonBoundaryConfig',
            carbonBoundaryId: arg.carbonBoundaryId,
            subCategoryId: arg.subCategoryId,
        }}]
       // transformResponse: (responseData) => responseData.data
    }),

    ConfigDevice: build.mutation({ // 排放边界配置   设备界面 保存
        query: (body) => ({
            url: `Carbon/CarbonEmissionBoundary/ConfigDeviceCaebonBoundary`,
            method: 'POST',
            body,
        }),
        invalidatesTags: (result, error, arg) => [{type: "carbon", id: {
            type: 'QueryCarbonBoundaryConfig',
            carbonBoundaryId: arg.carbonBoundaryId,
            subCategoryId: arg.subCategoryId,
        }}]
    }),
    ApiData: build.mutation({ // 保存Api数据
        query: ({enterpriseId,carbonBoundaryId,subCategoryId,post}) => ({
            url: `Carbon/CarbonEmissionBoundary/SaveCarbonBoundaryApiData?enterpriseId=${enterpriseId}&carbonBoundaryId=${carbonBoundaryId}&subCategoryId=${subCategoryId}`,
            method: 'POST',
            body: post,
        }),
    }),
    SetConfigData: build.mutation({ // 碳排放边界数据设置
        query: ({enterpriseId,carbonBoundaryId,post}) => ({
            url: `Carbon/CarbonEmissionBoundary/ConfigDataCarbonBoundary?enterpriseId=${enterpriseId}&carbonBoundaryId=${carbonBoundaryId}`,
            method: 'POST',
            body: post,
            
        }),
        invalidatesTags: (result, error, arg) =>  [{type: 'carbon', id: 'QueryCarbonBoundaryDataConfig'+arg.carbonBoundaryId+arg.subCategoryId}]
    }),
   
     //  数据录入
     importData: build.mutation({ // 文件导入  二进制文件作为参数 报错？？
        query: (body) => ({
            url: `/Carbon/CarbonEnterpriseDataInput/ImportData`,
            method: 'POST',
            body,
        })             
    }),
    saveData: build.mutation({ // 保存数据
        query: ({year,month, enterpriseId,body}) => ({
            url: `Carbon/CarbonEnterpriseDataInput/SaveInputData?year=${year}&month=${month}&enterpriseId=${enterpriseId}`,
            method: 'POST',
            body
        }),
       
         
    }),

    emissionUnit: build.query({   // 查询排放单元
        query: ({year, month,enterpriseId}) => ({
            url:`Carbon/CarbonEnterpriseDataInput/QueryCarbonEmissionUnit?year=${year}&month=${month}&enterpriseId=${enterpriseId}`,
            method: "GET",
        }),
    }),

    // 配额管理
    Quota: build.query({   // 获取碳排配额  去年
        query: ({enterpriseId,year}) => ({
            url:`Carbon/CarbonQuotaManagement/QueryCarbonQuota?enterpriseId=${enterpriseId}&year=${year}`,
            method: "GET",
            transformResponse: responseData => responseData,
        }),
    }),
    Emission: build.query({   // 获取碳排配额 当年
        query: (enterpriseId) => ({
            url:`Carbon/CarbonQuotaManagement/QueryCarbonEmission?enterpriseId=${enterpriseId}`,
            method: "GET",
            transformResponse: responseData => responseData,
        }),
    }),
    SaveQuota: build.mutation({ // 保存碳排配额
        query: (body) => ({
            url: `Carbon/CarbonQuotaManagement/SaveCarbonQuota`,
            method: 'POST',
            body,
        })             
    }),
    
    SaveTarget: build.mutation({ // 保存碳排目标值
        query: (body) => ({
            url: `Carbon/CarbonQuotaManagement/SaveCarbonTarget`,
            method: 'POST',
            body,
        })             
    }),

    // 预警策略配置

    StrategyAll: build.query({   // 查询预警策略配置
        query: () => ({
            url:`Carbon/CarbonWarningStrategy/QueryStrategyAll`,
            method: "GET",
            transformResponse: responseData => responseData,
        }),
    }),
  
    EnableStrategy: build.mutation({ // 启用/禁用预警策略
        query: ({ruleId,enabled}) => ({
            url: `Carbon/CarbonWarningStrategy/EnableStrategy?ruleId=${ruleId}&enabled=${enabled}`,
            method: 'POST',
            
        })             
    }),        
    InsertStrategy: build.mutation({ // 添加预警策略
        query: (body) => ({
            url: `Carbon/CarbonWarningStrategy/InsertStrategy`,
            method: 'POST',
            body
        })             
    }),
    UpdateStrategy: build.mutation({ // 编辑预警策略
        query: (body) => ({
            url: `Carbon/CarbonWarningStrategy/UpdateStrategy`,
            method: 'POST',
            body
        })             
    }),
    DeleteStrategy: build.mutation({ // 删除预警策略
        query: (ruleId) => ({
            url: `Carbon/CarbonWarningStrategy/DeleteStrategy?ruleId=${ruleId}`,
            method: 'DELETE',
        })             
    }),

        // 园区图片 
        updateImg: build.mutation({  // 上传园区图片
            query: (body) => ({
                url:`Carbon/CarbonParkImage/PostParkImage`,
                method: 'POST',
                body,
            }),
           invalidatesTags: (result, error, arg) => [{type: "carbon", id: 'QueryProjectPhoto'}]
        }),
      
       



        // 运行态******
        // 碳排概述

        ProjectPhoto: build.query({   // 获取园区图片
            query: (projectId) => ({
                url:`Carbon/CarbonOverviewRuntime/QueryProjectPhoto?projectId=${projectId}`,
                method: "GET",
            }),
            transformResponse: responseData => responseData.data,
          providesTags: (result, error, page) =>[{type: "carbon", id: 'QueryProjectPhoto'}]
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

      // 测试用
      Testq: build.query({    
        query: (name='') =>({
            url:`/Monitor/LineManager/Query?projectId=1&type=1&areaId=1&lineName=${name}&culture=zh`,  
            method: "GET",
            transformResponse: (response, meta, arg) => response.data,
        }),
        providesTags: (result=[])=> ["test", ...result.map(r => ({type: 'test', id: r.id}))],
       }), 
       Testm: build.mutation({  //  
        query: (content) => ({
            url:`/Monitor/LineManager/Add?culture=zh`,
            method: 'POST',
            body: {
                areaId: 1,
                id:0,  
                lineType: 1,
                name: content,
                projectId: 1
            },
        }),
        invalidatesTags: ["test"]
        
      }),
      Testu: build.mutation({  //  
        query: ({name,id}) => ({
            url:`/Monitor/LineManager/Update?projectId=1&id=25&name=${name}&culture=zh`,
            method: 'get',
        }),
        invalidatesTags:(result, error, arg) => [{type: "test", id: arg.id}]
        
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
     useEnableCarbonMutation,
     useUpdateFactorMutation,
     useBoundaryTreeQuery,
     useAddCarbonBoundaryMutation,
     useUpdateBoundaryMutation,
     useDeleteBoundaryMutation,
     useDataConfigQuery,
     useConfigDataQuery,
     useBoundaryConfigQuery,
     useConfigDeviceMutation,
     useApiDataMutation,
     useSetConfigDataMutation,
     useEmissionUnitQuery,   
     useImportDataMutation,
     useSaveDataMutation,
     useQuotaQuery,
     useEmissionQuery,  
     useSaveQuotaMutation,
     useSaveTargetMutation, 
     useDeleteStrategyMutation,
     useEnableStrategyMutation,
     useInsertStrategyMutation,
     useStrategyAllQuery,
     useUpdateStrategyMutation,
     useTestqQuery,
     useTestmMutation,
    } = carbonSlice