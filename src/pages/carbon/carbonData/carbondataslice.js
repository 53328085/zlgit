import { apiSlice } from "@redux/rtkquery"
 
export const CarbonData = apiSlice.injectEndpoints({   
   // tagTypes: ['boundary'],     
    endpoints: build => ({
        CarbonEmission: build.query({   // 获取碳排数据
            query: ({pageNum,pageSize},body) => ({
                url:`Carbon/CarbonEmissionDataRuntime/QueryCarbonEmissionData?pageNum=${pageNum}&pageSize=${pageSize}`,
                method: "GET",
                body,
            }),
        }),      
    }),


})
console.dir(CarbonData)
export const {
    useCarbonEmissionQuery
    
    } = CarbonData