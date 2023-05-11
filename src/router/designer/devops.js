/*  运维管理 配置 */
import {lazy} from 'react'
 
const Inspection = lazy(() => import("@pages/devops/configure/inspection"))
const Order= lazy(() => import("@pages/devops/configure/order"))
const InspectionContent = lazy(() => import("@pages/devops/configure/inspectionContent"))
const InspectionAddress = lazy(() => import("@pages/devops/configure/inspectionAddress"))
import store from '@redux/store'
const menus = [];
const components = { 
    '021101': Order,
    '021103':InspectionContent,
    '021104':InspectionAddress,
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
    console.log(runmen)
})

export default  menus