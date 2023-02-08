/*  碳排管理 */
import {lazy} from 'react'
import store from '@redux/store'
const Monitor = lazy(() => import("@pages/storage/monitor"))

const menus = [];
const components = {
    '011101': Monitor, 
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderRunMenus?.['runtimeStorage']
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})

export default  menus