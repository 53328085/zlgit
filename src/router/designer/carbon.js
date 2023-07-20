/*  碳排管理 */
import {lazy} from 'react'
 const Quota = lazy(() => import("@pages/carbon/configure/quota"))


export let carbon = {
    '021001': Quota, 
}

 
