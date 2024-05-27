/**
 * 能耗定额配置
 */
import {lazy} from 'react'
const QuotaManagement = lazy(() => import("@pages/quota/configure/quotaManagement"))
const QuotaWarning = lazy(() => import("@pages/quota/configure/quotaWarning"))
console.log(QuotaManagement)
export let quota = {
    '021201': QuotaManagement,
    '021202': QuotaWarning,
}
