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
const Comindex = lazy(() => import("../comindex"))
const Quota = lazy(() => import("@pages/quota/configure/index"))
const Ledger = lazy(() => import("@pages/ledger/configure/index"))
const Cabinets = lazy(() => import("@pages/cabinet/configure/index"))

import  {designerCommon} from './common'
import  {designerMonitor} from './monitoring'
import  {designerSafe} from './electric'
import  {designerDistribution} from './distribution'
import  {designerPrepay} from './prepayment'
import {designerEnergy} from './energy'
import  {designerSolar} from './photovoltaic'
import  {storage} from './storage'
import {designCarbonEmissionManage} from './carbon'
import  {maintenance} from './devops'
import {quota} from './quota'
import {ledger} from './ledger'
import {cabinets} from './cabinets'
import {designerWaterManagement} from './designerWaterManagement'
import {airConditioningManagement} from './airConditioningManagement'
import {streetLightManagement} from './streetLightManagement'
 export const designerComponents = { 
  '0201': Common,
  '0202': Project,
//  '0203': Monitoring,
  "0203":Comindex,
  '0204': Electric,
  '0205': Distribution,
  '0206': Prepayment,
  '0207': Comindex,
  '0208': Solar,
  '0209': Comindex,
  '0210': Comindex,
  '0211': Devops,
  '0212': Quota,
  "0213": Ledger,
  '0214': Cabinets,
  "0215": Comindex,
  "0216": Comindex,
  "0217": Comindex,
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
  designCarbonEmissionManage,
  maintenance,
  quota,
  ledger,
  cabinets,
  designerWaterManagement,
  airConditioningManagement,
  streetLightManagement,
}


 

 

 