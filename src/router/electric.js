/*  电气安全 */
import {lazy} from 'react'
import store from '@redux/store'
const Safe = lazy(() => import("../pages/electric/safe"))
const Warning= lazy(() => import("../pages/electric/warning"))
const menus = [];
const components = {
    '010601': Safe,
    '010602': Warning,
    
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderRunMenus?.['runtimeSafe'] 
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus