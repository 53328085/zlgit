/*  碳排管理 */
import {lazy} from 'react'
import store from '@redux/store'
//const Monitor = lazy(() => import("@pages/carbon/monitor"))
const Summary = lazy(() => import("@pages/carbon/summary"))
const Details = lazy(() => import("@pages/carbon/details"))
const Direction = lazy(() => import("@pages/carbon/direction"))
const Report = lazy(() => import("@pages/carbon/report"))
const menus = [];
const components = {
    '011201': Summary, 
    '011202': Details, 
    '011203': Direction, 
    '011204': Report, 
}
store.subscribe(() => {
    const runmen= store.getState().system.menus?.siderRunMenus?.['runtimeCarbon']
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})

export default  menus