/*  运行监控 */
import {lazy} from 'react'
import store from '@redux/store'
const DeviceType = lazy(() => import("@pages/monitoring/configure/deviceType"))
const Device = lazy(() => import("@pages/monitoring/configure/device"))
const Lighting= lazy(() => import("@pages/monitoring/configure/lighting"))
const Line = lazy(() => import("@pages/monitoring/configure/line"))
const Warning= lazy(() => import("@pages/monitoring/configure/warning"))
const menus = [];
const components = {
    '020301': DeviceType,
    '020302': Device,
    '020303': Lighting,
    '020304': Line,
    '020305': Warning,
}
store.subscribe(() => {
    try {
        const runmen= store.getState().system.menus.siderDesignerMenus?.['designerMonitor']
        if (Array.isArray(runmen) && runmen.length > 0) {        
           runmen.forEach(r => {
            let {no, key} = r;
            let Com = components[no];
            if (Com) menus.push({path: key, element: <Com />}) 
           })
        }
    } catch (error) {
        
    }
   
})

export default  menus
