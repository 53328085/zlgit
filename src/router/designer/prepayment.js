/*  结算收费 配置 */
import {lazy} from 'react'
const Quota = lazy(() => import("@pages/prepayment/configure/quota"))
 


export let designerPrepay = {
    '020601': Quota,
}


