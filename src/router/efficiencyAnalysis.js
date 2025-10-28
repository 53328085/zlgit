// 照明控制
import {lazy} from 'react'
const KpiReport = lazy(() => import("../pages/efficiencyAnalysis/kpiReport"))
const AirCompressorKPI = lazy(() => import("../pages/efficiencyAnalysis/airCompressorKPI"))
const RefrigeratorCOP = lazy(() => import("../pages/efficiencyAnalysis/refrigeratorCOP"))
const AirConditionerKPI = lazy(() => import("../pages/efficiencyAnalysis/airConditionerKPI"))
 
export let efficiencyAnalysis = {
    '012201': KpiReport,  // kpi报表
    '012202': AirCompressorKPI, // 空压机KPI
    '012203': RefrigeratorCOP, // 制冷机KPI
    '012204': AirConditionerKPI, // 空调KPI
    
    
}
