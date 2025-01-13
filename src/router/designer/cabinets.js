/*  智能配电柜 */
import {lazy} from 'react'

const Setting = lazy(() => import("@pages/cabinet/configure/siteSetting"))  // 站点设置

export let cabinets = {
    '021401': Setting
}