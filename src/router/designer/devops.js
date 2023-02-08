/*  运维管理 配置 */
import {lazy} from 'react'
 
const Inspection = lazy(() => import("@pages/devops/configure/inspection"))
const Order= lazy(() => import("@pages/devops/configure/order"))
 

import store from '@redux/store'
const menus = [];
const components = { 
    '021101': Order,
    '021102': Inspection, 
}
store.subscribe(() => {
    const runmen= store.getState().system.menus?.siderDesignerMenus?.['maintenance']
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus