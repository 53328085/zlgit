/*  光伏发电 配置 */
import {lazy} from 'react'
const Station = lazy(() => import("@pages/photovoltaic/configure/station"))
const Inverter = lazy(() => import("@pages/photovoltaic/configure/inverter"))
const Chart= lazy(() => import("@pages/photovoltaic/configure/chart"))

import store from '@redux/store'
const menus = [];
const components = {
    '020801': Station, 
    '020802': Inverter,
    '020803': Chart,
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderDesignerMenus?.['designerSolar']
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus

