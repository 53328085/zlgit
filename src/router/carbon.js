/*  碳排管理 */
import {lazy} from 'react'

 
const Summary = lazy(() => import("@pages/carbon/summary"))  // 碳排概述
const Examining = lazy(() => import("@pages/carbon/examining")) // 碳排考核跟踪
const CarbonData = lazy(() => import("@pages/carbon/carbonData")) // 碳排查数据
const Details = lazy(() => import("@pages/carbon/details")) // 碳排查管理
const Direction = lazy(() => import("@pages/carbon/direction")) // 碳排流向

const Market = lazy(() => import("@pages/carbon/market")) // 碳排流向
const Report = lazy(() => import("@pages/carbon/report"))

export let runtimeCarbonEmissionManager = {
    '011201': Summary,   
    '011202': Examining, 
    '011203': CarbonData, 
    '011204': Details, 
    '011205': Direction,
    '011206': Market,
    '011207': Report, 
}
