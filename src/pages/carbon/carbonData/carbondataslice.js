import { apiSlice } from "@redux/rtkquery"
 
export const CarbonData = apiSlice.injectEndpoints({   
   // tagTypes: ['boundary'],     
    endpoints: build => ({
        
        Emission: build.query({   // 获取碳排数据
            query: ({pageNum,pageSize},body) => ({
                url:`Carbon/CarbonEmissionDataRuntime/QueryCarbonEmissionData?pageNum=${pageNum}&pageSize=${pageSize}`,
                method: "POST",
                body,
            }),
        }),  
        Boundary: build.query({   // 获取设备列表树
            query: (enterpriseId) => ({
                url:`Carbon/CarbonEmissionDataRuntime/QueryCarbonBoundary?enterpriseId=${enterpriseId}`,
                method: "GET",
                
            }),
        }),          
    }),


})
console.dir(CarbonData)
export const {
    useEmissionQuery,
    useBoundaryQuery
    } = CarbonData