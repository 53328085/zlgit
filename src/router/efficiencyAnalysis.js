// 能效分析
import {lazy} from 'react'
const KpiReport = lazy(() => import("../pages/efficiencyAnalysis/kpiReport"))
const AirCompressorKPI = lazy(() => import("../pages/efficiencyAnalysis/airCompressorKPI"))
const RefrigeratorCOP = lazy(() => import("../pages/efficiencyAnalysis/refrigeratorCOP"))
const AirConditionerKPI = lazy(() => import("../pages/efficiencyAnalysis/airConditionerKPI"))
const BoilerKPI = lazy(() => import("../pages/efficiencyAnalysis/boilerKPI"))
const HeatPumpKPI = lazy(() => import("../pages/efficiencyAnalysis/heatPumpKPI"))
 
export let efficiencyAnalysis = {
    '012201': KpiReport,  // kpi报表
    '012202': AirCompressorKPI, // 空压机KPI
    '012203': RefrigeratorCOP, // 制冷机KPI
    '012204': AirConditionerKPI, // 空调KPI
    '012205': BoilerKPI, // 锅炉KPI
    '012206': HeatPumpKPI, // 热泵KPI
    
}
