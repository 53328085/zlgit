/*  碳排管理 */
import {lazy} from 'react'
 const EnterpriseSettting = lazy(() => import("@pages/carbon/configure/enterpriseSettting"))   // 企业设置
 const Bound = lazy(() => import("@pages/carbon/configure/bound"))   // 排放边界
 const DataInput = lazy(() => import("@pages/carbon/configure/dataInput"))  // 数据录入
 const Quota = lazy(() => import("@pages/carbon/configure/quota"))  // 配额管理
 const WarningSetting = lazy(() => import("@pages/carbon/configure/warningSetting"))  // 预警配置

export let designCarbonEmissionManage = {
    '021001': EnterpriseSettting, 
    '021002': Bound, 
    '021003': DataInput, 
    '021004': Quota, 
    '021005': WarningSetting, 
}

 
