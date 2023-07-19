/*  配电管理 */
import {lazy} from 'react'
import store from '@redux/store'
const Summary = lazy(() => import("../pages/distribution/summary"))
const Loop = lazy(() => import("../pages/distribution/loop"))
const Map= lazy(() => import("../pages/distribution/map"))
const Report = lazy(() => import("../pages/distribution/report"))
const Surroundings= lazy(() => import("../pages/distribution/surroundings"))
const Video = lazy(() => import("../pages/distribution/video"))
const Warning= lazy(() => import("../pages/distribution/warning"))
const Transformer = lazy(() => import("../pages/distribution/transformer"))
const menus = [];
const components = {
    '010701': Summary,
    '010702': Map,
    '010703': Transformer,
    '010704': Loop,
    '010705': Surroundings,
    '010706': Video,
    '010707': Warning,
    '010708': Report
}

export let runtimeDistribution = {
    '010701': Summary,
    '010702': Map,
    '010703': Transformer,
    '010704': Loop,
    '010705': Surroundings,
    '010706': Video,
    '010707': Warning,
    '010708': Report
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderRunMenus?.['runtimeDistribution'] 
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus
