/*  储能 配置 */
import {lazy} from 'react'

const StoragePrice = lazy(() => import("@pages/storage/configure/price"))
const Strategy = lazy(() => import("@pages/storage/configure/strategy")) 
const StorageDevice = lazy(() => import("@pages/storage/configure/storageDevice")) 
const StorageEnvironment = lazy(() => import("@pages/storage/configure/storageEnvironment")) 
const StorageSetting = lazy(() => import("@pages/storage/configure/storageSetting")) 
const AutoMode = lazy(() => import("@pages/storage/configure/autoMode")) 
const ManualMode = lazy(() => import("@pages/storage/configure/manualMode")) 
const Container = lazy(() => import("@pages/storage/configure/container")) 

export let storage = {
    '020901': StorageSetting,      
    '020902': Container,
    '020903': StorageDevice,
    '020904': StorageEnvironment,
    '020905': ManualMode,
    '020906': Strategy,
    '020907': AutoMode,
   
    '020908': StoragePrice,
    
}

