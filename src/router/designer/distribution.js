/*  配电管理 配置 */
import {lazy} from 'react'
import store from '@redux/store'
const Room = lazy(() => import("@pages/distribution/configure/index/room"))
const Topology = lazy(() => import("@pages/distribution/configure/index/topology"))
const LineManage = lazy(() => import("@pages/distribution/configure/index/lineManage"))
const TransformerManage = lazy(() => import("@pages/distribution/configure/index/transformerManage"))
const MonitorManage = lazy(() => import("@pages/distribution/configure/index/monitorManage"))
const SensorManage = lazy(() => import("@pages/distribution/configure/index/sensorManage"))
 
const menus = [];
const components = {
    '020501': Room,
    '020502': Topology,
    '020503': LineManage,
    '020504': TransformerManage,
    '020505': MonitorManage,
    '020506': SensorManage,
}
store.subscribe(() => {
    const runmen= store.getState().system.menus?.siderDesignerMenus?.['designerDistribution'] 
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus
