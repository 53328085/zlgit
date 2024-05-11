import { apiSlice } from "@redux/rtkquery"
 
export const boundarySlice = apiSlice.injectEndpoints({   
    tagTypes: ['boundary'],     
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
        boundaryConfig: build.query({ // 查询排放边界配置结构
            query: ({projectId,enterpriseId,carbonBoundaryId,subCategoryId}) => ({
                url: `Carbon/CarbonEmissionBoundary/QueryCarbonBoundaryConfig?projectId=${projectId}&enterpriseId=${enterpriseId}&carbonBoundaryId=${carbonBoundaryId}&subCategoryId=${subCategoryId}`,
                method: 'GET',
            }),
        }),
        DataConfig: build.query({ // 获取边界数据资源配置
            query: ({enterpriseId,carbonBoundaryId}) => ({
                url: `Carbon/CarbonEmissionBoundary/QueryCarbonBoundaryDataConfig?enterpriseId=${enterpriseId}&carbonBoundaryId=${carbonBoundaryId}`,
                method: 'GET',
            }),
        }),
    }),


})
console.dir(boundarySlice)
export const {
     useBoundaryTreeQuery,
     useAddCarbonBoundaryMutation,
     useUpdateBoundaryMutation,
     useDeleteBoundaryMutation,
     useBoundaryConfigQuery,
     useDataConfigQuery
    } = boundarySlice