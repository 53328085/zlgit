/*  电气安全 配置 */
import {lazy} from 'react'
import store from '@redux/store'
const Quota = lazy(() => import("@pages/electric/configure/quota"))
 
const menus = [];
const components = {
    '020401': Quota,
    
    
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderRunMenus?.['designerSafe'] 
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus