import { apiSlice } from "@redux/rtkquery"
 
export const DataSlice = apiSlice.injectEndpoints({   
   // tagTypes: ['boundary'],     
    endpoints: build => ({
      
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
       
    }),


})
console.dir(DataSlice)
export const {
    useEmissionUnitQuery,
   
    useImportDataMutation,
    useSaveDataMutation,
    } = DataSlice