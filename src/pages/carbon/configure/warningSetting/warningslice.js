import { apiSlice } from "@redux/rtkquery"
 
export const WarningSlice = apiSlice.injectEndpoints({   
   // tagTypes: ['boundary'],     
   endpoints: build => ({
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
    }),


})
console.dir(WarningSlice)
  export const {
    useDeleteStrategyMutation,
    useEnableStrategyMutation,
    useInsertStrategyMutation,
    useStrategyAllQuery,
    useUpdateStrategyMutation,

    } = WarningSlice  