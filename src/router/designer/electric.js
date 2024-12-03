/*  电气安全 配置 */
import {lazy} from 'react'
const Quota = lazy(() => import("@pages/electric/configure/quota")) 
const Rules = lazy(() => import("@pages/electric/configure/safetyRules")) 
export let designerSafe = {
    '020401': Quota,
    // '020401': Rules,
}

