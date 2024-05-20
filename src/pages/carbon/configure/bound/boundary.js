import { apiSlice } from "@redux/rtkquery"
 
export const boundarySlice = apiSlice.injectEndpoints({   
    tagTypes: ['boundary','dataconfig'],     
    endpoints: build => ({
        BoundaryTree: build.query({   // 获取碳排边界树
            query: (enterpriseId=0) => ({
                url:`/Carbon/CarbonEmissionBoundary/QueryCarbonBoundary?enterpriseId=${enterpriseId}`,
                method: "GET",
            }),
            transformResponse: responseData => responseData,
            providesTags: ['boundary']
        }),
      
        AddCarbonBoundary: build.mutation({ // 新增边界子项
            query: (body) => ({
                url: `/Carbon/CarbonEmissionBoundary/AddCarbonBoundary`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ["boundary"]
             
        }),
        updateBoundary: build.mutation({ // 更新边界子项名称
            query: ({id,name}) => ({
                url: `Carbon/CarbonEmissionBoundary/UpadteCarbonBoundary?id=${id}&name=${name}`,
                method: 'POST',
            }),
            invalidatesTags: ["boundary"],
             
        }),
       deleteBoundary: build.mutation({ // 删除子项
            query: (id) => ({
                url: `Carbon/CarbonEmissionBoundary/DeleteCarbonBoundary?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["boundary"],
             
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
                providesTags: ['dataconfig']
            }),
        }),
         BoundaryConfig: build.query({ // 查询排放边界配置结构
            query: ({enterpriseId,carbonBoundaryId,subCategoryId,projectId}) => ({
                url: `Carbon/CarbonEmissionBoundary/QueryCarbonBoundaryConfig?enterpriseId=${enterpriseId}&carbonBoundaryId=${carbonBoundaryId}&projectId=${projectId}&subCategoryId=${subCategoryId}`,
                method: 'GET',
            }),
        }),

        ConfigDevice: build.mutation({ // 排放边界配置
            query: (body) => ({
                url: `Carbon/CarbonEmissionBoundary/ConfigDeviceCaebonBoundary`,
                method: 'POST',
                body,
            }),
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
                invalidatesTags: ['dataconfig']
            }),
        }),
    }),


})
 
export const {
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
    } = boundarySlice