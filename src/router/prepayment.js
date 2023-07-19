/*  结算收费 */
import {lazy} from 'react'
import store from '@redux/store'
const Summary = lazy(() => import("../pages/prepayment/summary"))
const Bill = lazy(() => import("../pages/prepayment/bill"))
const Charge= lazy(() => import("../pages/prepayment/charge"))
const Customer = lazy(() => import("../pages/prepayment/customer"))
const Data= lazy(() => import("../pages/prepayment/data"))
const Property = lazy(() => import("../pages/prepayment/property"))
const Reading= lazy(() => import("../pages/prepayment/reading"))
const Recharge = lazy(() => import("../pages/prepayment/recharge"))
const Run = lazy(() => import("../pages/prepayment/run"))
/*   export  const prepayment = [ // 结算收费
   {
     label: '概述' ,
     key: "summary",
     icon: <Micon />
   },
   {
     label: '客户管理',
     key: "customer",
     icon: <Micon />
   },
   {
     label: '能源收费',
     key: "charge",
     icon: <Micon />
   },
   {
     label: '物业收费',
     key: "property",
     icon: <Micon />
   },
   {
     label: '账单报表',
     key: "bill",
     icon: <Micon />
   },
   {
     label: '数据报表',
     key: "data",
     icon: <Micon />
   },
   {
     label: '手动抄表',
     key: "reading",
     icon: <Micon />
   },
   {
    label: '充值补助',
    key: "recharge",
    icon: <Micon />
   },
   {
     label: '运行报告',
     key: "run",
     icon: <Micon />
   },
  ] */
const menus = [];
const components = {
    '010801': Summary,
    '010802': Customer,
    '010803': Charge,
    '010804': Property,
    '010805': Bill,
    '010806': Data,
    '010807': Reading,
    '010808': Recharge,
    '010809': Run
}
export let runtimePrepay = {
  '010801': Summary,
  '010802': Customer,
  '010803': Charge,
  '010804': Property,
  '010805': Bill,
  '010806': Data,
  '010807': Reading,
  '010808': Recharge,
  '010809': Run
}
store.subscribe(() => {
    const runmen= store.getState().system.menus.siderRunMenus?.['runtimePrepay'] 
    if (Array.isArray(runmen) && runmen.length > 0) {        
       runmen.forEach(r => {
        let {no, key} = r;
        let Com = components[no];
        if (Com) menus.push({path: key, element: <Com />}) 
       })
    }
})
export default  menus

