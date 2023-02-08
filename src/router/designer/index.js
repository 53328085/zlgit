import { lazy } from "react";

const Project = lazy(() => import("@pages/defauthome/configure/index")) // 项目概述

const Common = lazy(() => import("@pages/module/index")) // 公共模块

const Monitoring = lazy(() => import("@pages/monitoring/configure/index"))

const Electric = lazy(() => import("@pages/electric/configure/index"))

const Distribution = lazy(() => import("@pages/distribution/configure/index"))


const Energy = lazy(() => import("@pages/energy/configure/index"))

const Devops = lazy(() => import("@pages/devops/index"))

const Prepayment = lazy(() => import("@pages/prepayment/configure/index"))
const Carbon = lazy(() => import("@pages/carbon/index"))
const Photovoltaic = lazy(() => import("@pages/photovoltaic/index"))

const Storage = lazy(() => import("@pages/storage/index"))

import commonRoutes from './common'
import monitorRoutes from './monitoring'
import electricRoutes from './electric'
import distributionRoutes from './distribution'
import prepayRoutes from './prepayment'
import energyRoutes from './energy'
 export const designerComponents = {
  '0201': Common,
  '0202': Project,
  '0203': Monitoring,
  '0204': Electric,
  '0205': Distribution,
  '0206': Prepayment,
  '0207': Energy,
} 
export const designerChildrenRoute = {
  '0201': commonRoutes,
  '0203': monitorRoutes,
  '0204': electricRoutes,
  '0205': distributionRoutes,
  '0206': prepayRoutes,
  '0207': energyRoutes
}

 

 

 