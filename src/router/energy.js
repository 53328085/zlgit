/*  能源管理 */
import {lazy} from 'react'

const Summary = lazy(() => import("../pages/runtimeEnergy/summary"))
const Synthetical = lazy(() => import("../pages/runtimeEnergy/synthetical"))
const Assorting = lazy(() => import("../pages/runtimeEnergy/assorting"))
const Ranking= lazy(() => import("../pages/runtimeEnergy/ranking"))
const TimePeriodEnergy = lazy(() => import("../pages/runtimeEnergy/timePeriodEnergy"))
const Report = lazy(() => import("../pages/runtimeEnergy/report"))


const Direction = lazy(() => import("../pages/runtimeEnergy/direction"))
const Analysis = lazy(() => import("../pages/runtimeEnergy/analysis"))
const Quota = lazy(() => import("../pages/runtimeEnergy/quota")) //定额能耗
const Comm = lazy(() => import("../pages/runtimeEnergy/comm"))
const Cost = lazy(() => import("../pages/runtimeEnergy/cost"))
const LightingC = lazy(() => import("../pages/runtimeEnergy/lingingC") )
const Streetlamp = lazy(() => import("../pages/runtimeEnergy/streetLamp") )
const Air = lazy(() => import("../pages/runtimeEnergy/air"))
const Streetlight = lazy(() => import("../pages/runtimeEnergy/light"))
const Runreport = lazy(() => import("../pages/runtimeEnergy/runreport"))
const Region = lazy(() => import("../pages/runtimeEnergy/region"))
const Device = lazy(() => import("../pages/runtimeEnergy/device"))
const RealTimeMeterReading = lazy(() => import("../pages/runtimeEnergy/realTimeMeterReading"))
const IntensityCal = lazy(() => import("../pages/runtimeEnergy/intensityCal"))
const EfficiencyAdvance = lazy(() => import("../pages/runtimeEnergy/efficiencyAdvance"))
export let runtimeEnergy = {
    '010901': Summary, // 概述
    '010902': Synthetical, // 园区能耗
    '010903': Assorting, // 分类能耗
    '010904': Ranking , // 能耗排名
    '010905': TimePeriodEnergy,  // 分时能耗

    '010906': Report,  // 数据报表
    '010907': Direction,  // 能源流向
    '010908': Analysis, // 损耗分析
    '010909': RealTimeMeterReading, //实时抄表
    '010910': Comm, // 公共能耗

  //  '010911': Air, // 空调控制
  // '010912': Streetlight, // 路灯控制
  // '010913': LightingC, //照明控制
    '010914': Runreport, // 运行报告
    '010915': Region, // 区域能耗
    '010916': Device, // 重点设备
    '010930': IntensityCal, // 能耗强度分析
    '010933': EfficiencyAdvance, // 能效优化
}


