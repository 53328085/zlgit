/*  能源管理 */
import {lazy} from 'react'
import store from '@redux/store'
const Summary = lazy(() => import("../pages/energy/summary"))
const Synthetical = lazy(() => import("../pages/energy/synthetical"))
const Assorting = lazy(() => import("../pages/energy/assorting"))
const Ranking= lazy(() => import("../pages/energy/ranking"))
const Timesharing = lazy(() => import("../pages/energy/timesharing"))
const Report = lazy(() => import("../pages/energy/report"))


const Direction = lazy(() => import("../pages/energy/direction"))
const Analysis = lazy(() => import("../pages/energy/analysis"))
const Quota = lazy(() => import("../pages/energy/quota"))
const Comm = lazy(() => import("../pages/energy/comm"))
const Cost = lazy(() => import("../pages/energy/cost"))
const Lighting = lazy(() => import("../pages/energy/lighting") )
const Streetlamp = lazy(() => import("../pages/energy/streetLamp") )
const Air = lazy(() => import("../pages/energy/air"))
const Runreport = lazy(() => import("../pages/energy/runreport"))
const menus = [];
const components = {
    '010901': Summary, // 概述
    '010902': Synthetical, // 园区能耗
    '010903': Assorting, // 分类能耗
    '010904': Ranking , // 能耗排名 
    '010905': Timesharing,  // 分时能耗
    
    '010906': Report,  // 数据报表
    '010907': Direction,  // 能源流向
    '010908': Analysis, // 损耗分析
    '010909': Quota, //定额能耗
    '010910': Comm, // 公共能耗

    '010911': Air, // 空调控制
    '010912': Streetlamp, // 路灯控制
    '010913': Lighting, //照明控制
    '010914': Runreport, // 运行报告
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderRunMenus?.['runtimeEnergy'] 
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus

