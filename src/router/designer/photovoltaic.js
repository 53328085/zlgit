/*  光伏发电 配置 */
import {lazy} from 'react'
const Summary = lazy(() => import("../pages/photovoltaic/summary"))
const Analysis = lazy(() => import("../pages/photovoltaic/analysis"))
const Monitor= lazy(() => import("../pages/photovoltaic/monitor"))
const Surroundings = lazy(() => import("../pages/photovoltaic/surroundings"))
const Warn= lazy(() => import("../pages/photovoltaic/warn"))

const Run = lazy(() => import("../pages/photovoltaic/run"))
import store from '@redux/store'
const menus = [];
const components = {
    '011001': Summary, 
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderRunMenus?.['runtimeSolar']
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus

