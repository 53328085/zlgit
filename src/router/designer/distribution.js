/*  配电管理 配置 */
import {lazy} from 'react'
import store from '@redux/store'
const Room = lazy(() => import("@pages/distribution/summary"))
 
const menus = [];
const components = {
    '020501': Room, 
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderDesignerMenus?.['designerDistribution'] 
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus
