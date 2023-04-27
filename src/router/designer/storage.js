/*  储能 配置 */
import {lazy} from 'react'
import store from '@redux/store'
const StoragePrice = lazy(() => import("@pages/storage/configure/price"))
const Strategy = lazy(() => import("@pages/storage/configure/strategy")) 
const StorageDevice = lazy(() => import("@pages/storage/configure/storageDevice")) 
const StorageEnvironment = lazy(() => import("@pages/storage/configure/storageEnvironment")) 
const StorageSetting = lazy(() => import("@pages/storage/configure/storageSetting")) 
const AutoMode = lazy(() => import("@pages/storage/configure/autoMode")) 
const ManualMode = lazy(() => import("@pages/storage/configure/manualMode")) 
const Container = lazy(() => import("@pages/storage/configure/container")) 
const menus = [];
const components = {
    '020901': StorageSetting,      
    '020902': Container,
    '020903': StorageDevice,
    '020904': StorageEnvironment,
    '020905': ManualMode,
    '020906': Strategy,
    '020907': AutoMode,
   
    '020908': StoragePrice,
    
}

/*  '020901': StoragePrice,      
    '020902': Strategy,
    '020903': AutoMode,
    '020904': ManualMode,
    '020905': StorageDevice,
    '020906': StorageEnvironment,
    '020907': StorageSetting,
    '020908': Container, */
store.subscribe(() => {
    try {
        let runmen= store.getState().system.menus?.siderDesignerMenus?.['storage'] 
        
   
    if (Array.isArray(runmen) && runmen.length > 0) {        
        runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    } 

    } catch (error) {
        console.log(error)
    }
     
})

export default  menus