/*  运维管理 */
import {lazy} from 'react'
const Summary = lazy(() => import("../pages/devops/summary"))
const Inspection = lazy(() => import("../pages/devops/inspection"))
const Order= lazy(() => import("../pages/devops/order"))
const Runing = lazy(() => import("../pages/devops/runing"))
const Warning= lazy(() => import("../pages/devops/warning"))

import store from '@redux/store'
const menus = [];
const components = {
    '011301': Summary, 
    '011302': Warning,
    '011303': Order,
    '011304': Inspection,
    '011305': Runing,
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderRunMenus?.['runtimeMaintenance']
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus