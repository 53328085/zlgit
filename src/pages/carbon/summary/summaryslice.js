import { apiSlice } from "@redux/rtkquery"
import {createEntityAdapter} from '@reduxjs/toolkit'
const summaryApapter = createEntityAdapter()
const initialState = summaryApapter.getInitialState()
export const SummarySlice = apiSlice.injectEndpoints({   
   // tagTypes: ['boundary'],     
    endpoints: build => ({
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
               
            }),
        }),    
        Month: build.query({   // 获取月度碳排
            query: ({enterpriseId, type}) =>({
                url:`Carbon/CarbonOverviewRuntime/QueryMonthlyCarbonEmission?enterpriseId=${enterpriseId}&type=${type}`,
                method: "GET",
               
            }),
        }),  
        Ratio: build.query({   // 获取碳排占比
            query: ({enterpriseId, type=1}) =>({
                url:`Carbon/CarbonOverviewRuntime/QueryCarbonEmissionRatio?enterpriseId=${enterpriseId}&type=${type}`,
                method: "GET",
               
            }),
        }), 
        Energy: build.query({   // 分类能耗
            query: ({enterpriseId, type=1}) =>({
                url:`Carbon/CarbonOverviewRuntime/QueryClassifiedEnergyConsumption?enterpriseId=${enterpriseId}&type=${type}`,
                method: "GET",
               
            }),
        }),               
    }),


})
console.dir(SummarySlice)
export const {
    useOverviewQuery,
    useRealTimeQuery,
    useRankingQuery,
    useMonthQuery,
    useRatioQuery,
    useEnergyQuery,
    } = SummarySlice