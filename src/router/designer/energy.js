/*  能源管理 配置 */
import {lazy} from 'react'
import store from '@redux/store'
const Assorting = lazy(() => import("@pages/energy/configure/assorting"))
const Price = lazy(() => import("@pages/energy/configure/price"))
const Norm = lazy(() => import("@pages/energy/configure/norm"))
const Type = lazy(() => import("@pages/energy/configure/type"))
const Shift = lazy(() => import("@pages/energy/configure/shift"))
const Statistics = lazy(() => import("@pages/energy/configure/statistics"))
const menus = [];
const components = {
    '020701': Assorting, // 能耗分类
    '020702': Price,
    '020703': Norm,
    '020704': Type,
    '020705': Statistics,
    '020706': Shift,
   
}
store.subscribe(() => {
    const runmen= store.getState().system.menus?.siderDesignerMenus?.['designerEnergy'] 
    console.log(runmen)
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus

