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
    '020901': StoragePrice,   
    '020908': Container,
    '020902': Strategy,
    '020903': AutoMode,
    '020904': ManualMode,
    '020905': StorageDevice,
    '020906': StorageEnvironment,
    '020907': StorageSetting,
    
}
store.subscribe(() => {
    try {
        let runmen= store.getState().system.menus?.siderDesignerMenus?.['storage'] 
        let runary = Array.isArray(runmen) ? [...runmen] : []  
        let index = runary?.findIndex(item => item.no =='020908' )
      
       
        if (Array.isArray(runary) && runary.length> 0 && index > -1) { 
        let item = runary.splice(index, 1) 
         if(Array.isArray(item) && item.length > 0) runary.splice(1, 0, item[0])
        } 
   
    if (Array.isArray(runary) && runary.length > 0) {        
       runary.forEach(r => {
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