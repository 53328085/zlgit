/*  运行监控 */
import {lazy} from 'react'
import store from '@redux/store'
const Project = lazy(() => import("@pages/module/project"))
const User = lazy(() => import("@pages/module/user"))
const Region = lazy(() => import("@pages/module/region"))
const File= lazy(() => import("@pages/module/file"))
const Energy = lazy(() => import("@pages/module/energy"))
const Pricing= lazy(() => import("@pages/module/pricing"))
const Cockpit= lazy(() => import("@pages/module/cockpit"))

const menus = [];
const components = {
    '020101': Project,
    '020102': User,
    '020103': Region,
    '020105': Cockpit,
}
store.subscribe(() => {
    try {
        const runmen= store.getState().system?.menus.siderDesignerMenus?.['designerCommon']
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