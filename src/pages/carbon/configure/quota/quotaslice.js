import { apiSlice } from "@redux/rtkquery"
 
export const QutoSlice = apiSlice.injectEndpoints({   
   // tagTypes: ['boundary'],     
    endpoints: build => ({
        Quota: build.query({   // 获取碳排配额
            query: (enterpriseId) => ({
                url:`Carbon/CarbonQuotaManagement/QueryCarbonQuota?enterpriseId${enterpriseId}`,
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
        
       
    }),


})
console.dir(QutoSlice)
export const {
    useQuotaQuery,
    useSaveQuotaMutation    
    } = QutoSlice