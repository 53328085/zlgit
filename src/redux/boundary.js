import { apiSlice } from "./rtkquery"
 
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
        updateBoundary: build.mutation({ // 新增边界子项
            query: ({id,name}) => ({
                url: `/Carbon/CarbonEmissionBoundary/UpadteCarbonBoundary?id=${id}&name=${name}`,
                method: 'POST',
            }),
            invalidatesTags: ["boundary"]
             
        }),
    }),


})
console.dir(boundarySlice)
export const {
     useBoundaryTreeQuery,
     useAddCarbonBoundaryMutation,
     useUpdateBoundaryMutation,
    } = boundarySlice