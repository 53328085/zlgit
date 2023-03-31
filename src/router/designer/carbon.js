/*  碳排管理 */
import {lazy} from 'react'
import store from '@redux/store'
 const Quota = lazy(() => import("@pages/carbon/configure/quota"))

const menus = [];
const components = {
    '021001': Quota, 
}
store.subscribe(() => {
    const runmen= store.getState().system.menus?.siderDesignerMenus?.['carbon']
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})

export default  menus