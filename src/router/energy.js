/*  能源管理 */
import {lazy} from 'react'
import store from '@redux/store'
const Summary = lazy(() => import("../pages/energy/summary"))
const Synthetical = lazy(() => import("../pages/energy/synthetical"))
const Assorting = lazy(() => import("../pages/energy/assorting"))
const ComplexCost = lazy(() => import("../pages/energy/complexCost"))
const AssortingCost = lazy(() => import("../pages/energy/assortingCost"))
const Ranking= lazy(() => import("../pages/energy/ranking"))
const Timesharing = lazy(() => import("../pages/energy/timesharing"))
const Report = lazy(() => import("../pages/energy/report"))
const Usage= lazy(() => import("../pages/energy/usage"))

const Direction = lazy(() => import("../pages/energy/direction"))
const Analysis = lazy(() => import("../pages/energy/analysis"))
const Quota = lazy(() => import("../pages/energy/quota"))
const Comm = lazy(() => import("../pages/energy/comm"))
const Cost = lazy(() => import("../pages/energy/cost"))
const Lighting = lazy(() => import("../pages/energy/lighting") )
const Streetlamp = lazy(() => import("../pages/energy/streetLamp") )

const menus = [];
const components = {
    '010901': Summary, // 概述
    '010902': Synthetical, // 综合能耗
    '010903': Assorting, // 分类能耗
    '010904': ComplexCost, // 综合费用
    '010905': AssortingCost, // 分类费用

    '010906': Ranking,  // 分时能耗
    '010907': Timesharing,  // 分时能耗
    '010908': Report,
    '010909': Direction,
    '010910': Analysis,

    '010911': Quota,
    '010912': Comm,
    '010913': Streetlamp,
    '010914': Lighting,
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

