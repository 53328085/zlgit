/*  运行监控 */
import {lazy} from 'react'
import store from '@redux/store'
const Project = lazy(() => import("@pages/module/project"))
const User = lazy(() => import("@pages/module/user"))
const Region = lazy(() => import("@pages/module/region"))
const Base = lazy(() => import("@pages/module/base"))
// const Energy = lazy(() => import("@pages/module/energy"))
// const Pricing= lazy(() => import("@pages/module/pricing"))
const Cockpit= lazy(() => import("@pages/module/cockpit"))
const DataScreen = lazy(() => import("@pages/module/dataScreen"))

export let designerCommon = {
    '020101': Base,
    '020102': Project,
    '020103': User,
    '020104': Region,
    '020105': Cockpit,
    '020106': DataScreen,
}
