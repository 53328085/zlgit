/*  储能 配置 */
import {lazy} from 'react'
import store from '@redux/store'
const Base = lazy(() => import("@pages/storage/configure/base"))
const Quota = lazy(() => import("@pages/storage/configure/quota")) 
const menus = [];
const components = {
    '020901': Base,
    '021001': Quota,
    
}
store.subscribe(() => {
    const runmen= store.getState().system.menus?.siderDesignerMenus?.['storage'] 
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus