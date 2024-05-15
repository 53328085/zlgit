import { lazy } from "react";

const Project = lazy(() => import("@pages/defauthome/configure/index")) // 项目概述

const Common = lazy(() => import("@pages/module/index")) // 公共模块

const Monitoring = lazy(() => import("@pages/monitoring/configure/index"))

const Electric = lazy(() => import("@pages/electric/configure/index"))

//const Distribution = lazy(() => import("@pages/distribution/configure/index"))
 
const Distribution = lazy(() => import("@pages/distribution/index"))
const Energy = lazy(() => import("@pages/energy/configure/index"))

const Devops = lazy(() => import("@pages/devops/configure/index"))

const Prepayment = lazy(() => import("@pages/prepayment/configure/index"))
const Carbon = lazy(() => import("@pages/carbon/configure/index"))
const Solar = lazy(() => import("@pages/photovoltaic/configure/index")) //光伏发电

const Storage = lazy(() => import("@pages/storage/configure/index"))

import  {designerCommon} from './common'
import  {designerMonitor} from './monitoring'
import  {designerSafe} from './electric'
import  {designerDistribution} from './distribution'
import  {designerPrepay} from './prepayment'
import {designerEnergy} from './energy'
import  {designerSolar} from './photovoltaic'
import  {storage} from './storage'
import {carbon} from './carbon'
import  {maintenance} from './devops'
 export const designerComponents = { 
  '0201': Common,
  '0202': Project,
  '0203': Monitoring,
  '0204': Electric,
  '0205': Distribution,
  '0206': Prepayment,
  '0207': Energy,
  '0208': Solar,
  '0209': Storage,
  '0210': Carbon,
  '0211': Devops,
} 
export const designerRoutes = {
  designerCommon,
  designerMonitor,
  designerSafe,
  designerDistribution,
  designerPrepay,
  designerEnergy,
  designerSolar,
  storage,
  carbon,
  maintenance,
}


 

 

 