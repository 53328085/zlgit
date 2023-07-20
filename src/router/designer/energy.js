/*  能源管理 配置 */
import {lazy} from 'react'
const Assorting = lazy(() => import("@pages/energy/configure/assorting"))
const Price = lazy(() => import("@pages/energy/configure/price"))
const Norm = lazy(() => import("@pages/energy/configure/norm"))
const Type = lazy(() => import("@pages/energy/configure/type"))
const Shift = lazy(() => import("@pages/energy/configure/shift"))
const Statistics = lazy(() => import("@pages/energy/configure/statistics"))

export let designerEnergy =  {
    '020701': Assorting, // 能耗分类
    '020702': Price,
    '020703': Norm,
    '020704': Type,
    '020705': Statistics,
    '020706': Shift,
   
}


