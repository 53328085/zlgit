/*  碳排管理 */
import {lazy} from 'react'
import store from '@redux/store'
const Monitor = lazy(() => import("@pages/carbon/monitor"))

const menus = [];
const components = {
    '011201': Monitor, 
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderRunMenus?.['runtimeCarbon']
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})

export default  menus