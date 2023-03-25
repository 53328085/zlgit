/*  储能 配置 */
import {lazy} from 'react'
import store from '@redux/store'
const Base = lazy(() => import("@pages/storage/configure/price"))
const Strategy = lazy(() => import("@pages/storage/configure/strategy")) 
const StorageDevice = lazy(() => import("@pages/storage/configure/storageDevice")) 
const StorageEnvironment = lazy(() => import("@pages/storage/configure/storageEnvironment")) 
const StorageSetting = lazy(() => import("@pages/storage/configure/storageSetting")) 
const menus = [];
const components = {
    '020901': Base,
    '020902': Strategy,
    '020903': StorageDevice,
    '020904': StorageEnvironment,
    '020905': StorageSetting
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