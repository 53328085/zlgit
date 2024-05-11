import { apiSlice } from "@redux/rtkquery"
import {createEntityAdapter} from '@reduxjs/toolkit'
const summaryApapter = createEntityAdapter()
const initialState = summaryApapter.getInitialState()
export const SummarySlice = apiSlice.injectEndpoints({   
   // tagTypes: ['boundary'],     
    endpoints: build => ({
        Overview: build.query({   // 获取碳排数据
            query: (enterpriseId) => ({
                url:`Carbon/CarbonOverviewRuntime/QueryCarbonOverview?enterpriseId=${enterpriseId}`,
                method: "GET",
                transformResponse: responseData => responseData?.data?.data || {}
            }),
        }),  
        RealTime: build.query({   // 获取碳排数据
            query: ({enterpriseId, type}) => {
                let T= type ?? 1
                return ({
                url:`Carbon/CarbonOverviewRuntime/QueryRealTimeCarbonEmission?enterpriseId=${enterpriseId}&type=${T}`,
                method: "GET",
               
            })},
        }),  
        Ranking: build.query({   // 获取碳排数据
            query: ({enterpriseId, type}) =>({
                url:`Carbon/CarbonOverviewRuntime/QueryCarbonEmissionRanking?enterpriseId=${enterpriseId}&type=${type}`,
                method: "GET",
               
            }),
        }),    
        Month: build.query({   // 获取碳排数据
            query: (enterpriseId) =>({
                url:`Carbon/CarbonOverviewRuntime/QueryMonthlyCarbonEmission?enterpriseId=${enterpriseId}`,
                method: "GET",
               
            }),
        }),  
        Ratio: build.query({   // 获取碳排数据
            query: ({enterpriseId, type=1}) =>({
                url:`Carbon/CarbonOverviewRuntime/QueryCarbonEmissionRatio?enterpriseId=${enterpriseId}&type=${type}`,
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
    } = SummarySlice