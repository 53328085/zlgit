/*  能源管理 配置 */
import {lazy} from 'react'
const Assorting = lazy(() => import("@pages/runtimeEnergy/configure/assorting"))
const Price = lazy(() => import("@pages/runtimeEnergy/configure/price"))
const Norm = lazy(() => import("@pages/runtimeEnergy/configure/norm"))
const Type = lazy(() => import("@pages/runtimeEnergy/configure/type"))
const Shift = lazy(() => import("@pages/runtimeEnergy/configure/shift"))
const Statistics = lazy(() => import("@pages/runtimeEnergy/configure/statistics"))
const Device =  lazy(() => import("@pages/runtimeEnergy/configure/device"))
const Map =  lazy(() => import("@pages/runtimeEnergy/configure/map"))
const Rank =  lazy(() => import("@pages/runtimeEnergy/configure/rank"))
const TimePeriodSetting =  lazy(() => import("@pages/runtimeEnergy/configure/timePeriodSetting"))
export let designerEnergy =  {
    '020701': Assorting, // 能耗分类
    '020702': Price,
    '020703': Norm,
    '020704': Type,
    '020705': Statistics,
    '020706': Shift,
    '020707': Device,
    '020708': Map,
    '020709': Rank,
    '020710': TimePeriodSetting
}


