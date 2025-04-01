import { lazy } from "react";
import { Navigate, useRoutes} from "react-router-dom";
import {useSelector} from 'react-redux'
import {selectUser} from '@redux/user'

import Emptycom from "@com/useEmpty"
 
 
import {menus as Menus, currentscreen} from "@redux/systemconfig";

import {runtimeMonitor} from "./monitoring"; // 运行监控
import {runtimeEnergy} from "./energy"; // 能源管理
import  {runtimeMaintenance} from './devops'; // 运维管理
import  {runtimeSafe} from "./electric"; // 电气安全
import  {runtimeDistribution} from "./distribution"; // 配电管理
import  {runtimePrepay} from "./prepayment"; // 结算收费
import  {runtimeSolar} from "./photovoltaic"; // 光伏
import  {designerCommon} from "./designer/common";
import  {runtimeCarbonEmissionManager} from "./carbon" // 碳排管理
import  {runtimeStorage} from './storage' // 储能管理
import  {runtimeQuota} from './quota'
import {ledger} from './ledger.js'
import {cabinets} from './cabinets.js'
 let runRoutes = {
  runtimeMonitor,
  runtimeEnergy,
  runtimeMaintenance,
  runtimeSafe,
  runtimeDistribution,
  runtimePrepay,
  runtimeSolar,
  designerCommon,
  runtimeCarbonEmissionManager,
  runtimeStorage,
  runtimeQuota,
  ledger,
  cabinets
 }



const Login = lazy(() => import("@pages/Login"))
const Granary = lazy(() => import("@pages/Login/granary.js"))
const Projectlist = lazy(() => import("@pages/projectList"))

const Index = lazy(() => import("@pages/Home"))

const Defauthome = lazy(() => import("../pages/defauthome"))
const Project = lazy(() => import("@pages/defauthome/configure"))
//const Module = lazy(() => import("../pages/module/index"))
 

const Distribution = lazy(() => import("../pages/distribution/index"))
const Prepayment = lazy(() => import("../pages/prepayment/index")) 

const RoomDetail = lazy(() => import("../pages/roomDetail"))

const Topology = lazy(() => import("../pages/topology"))

//const Devicedetail = lazy(() => import("../pages/electric/devicedetail/devicedetail"))
const DeviceDetail = lazy(() => import("../pages/monitoring/gateway/deviceDetail"))
const GatewayDetail = lazy(() => import("../pages/monitoring/gateway/gatewayDetail"))
const Fform = lazy(() => import("../pages/test/fform.js"))
// const Directionful = lazy(() => import("../pages/energy/direction"))
const Directionful = lazy(() => import("../pages/energy/direction/directionfull"))
const Notfound = lazy(() => import("./notfound"))
const Comindex = lazy(() => import("./comindex"))

const Topologytest = lazy(() => import("../pages/topology/test"))
const DetailIndicators = lazy(() => import("../pages/quota/detailIndicators/index.jsx"))
const Loopname = lazy(() => import("../pages/distribution/statements/loopname.js"))
const Diskchart = lazy(() => import("../pages/cabinet/exhibition/index.jsx"))
import {designerComponents,  designerRoutes} from "./designer";
 
 
const lazyLoad = (moduleName) => {
  const Module = lazy(() => import(`@pages/screen/${moduleName}`)); 
  return <Module />;
}

const loginrouter =  [{
  path: "/login",
  element: <Login />
  }]
 export const LoginRouter = () => useRoutes(loginrouter)
 function Redirect() { // 路由守卫
  const {token} = useSelector(selectUser) || {}; 
  return token ? (<Projectlist/>) : (<Navigate to="/" />)  
 }

 function RedirectIndex({Com}) { // 路由守卫
 // const {token} = useSelector(selectUser) || {}; 
  const islog =window.sessionStorage.getItem("chintwulian")
  
  return islog ? (<Com />) : (<Navigate to="/" />)  
 }

 const components = {
  '0104': Defauthome,
  '0105': Comindex,
  '0106': Comindex,
  '0107': Distribution,
  '0108': Prepayment,
  '0109': Comindex,
  '0110': Comindex,
  '0111': Comindex,
  '0112': Comindex,
  '0113': Comindex,
  '0114': Comindex,
  '0115': Distribution,
  '0116': Comindex
} 

 

 let RunRoute = [];
 let DesignerRoute = [];




 let routes =  [
  {
    path: "/",
    element: <Login />   //    <Login />,   
    
    },
 
   {
     path: "/projectList",
     element: <RedirectIndex Com={Projectlist} />
   },
   // 进入项目

   {
     path: "/index", 
     element: <RedirectIndex Com={Index} />,
     children: [],
     key: 'run'
   },
   // 配置项目
   {
     path: "/config",
     element: <RedirectIndex Com={Index} />,
     children: [],
     key: 'ddesignere',
     
   },

   {
     path: "/roomDetail",
     element: <RoomDetail />
   },
   {
    path: "/topology",
    element: <Topology />
  },
  {
    path: '/devicedetail',
    element: <DeviceDetail />,
  },
/*   {
    path: '/devicedtl',
    element: <Devicedetail />
  }, */
  {
    path: '/gatewayDetail',
    element: <GatewayDetail />
  },
  {
    path: '/directionfull',
    element: <Directionful />
  },
   {
     path: '/zltest',
     element: <Fform/>, 
     loader: async (params)=> {
        await   console.log('params',params)
     }
   },
  
   {
    path: "/granary",
    element: <Granary />,   
    },
    {
      path: "/front",
      element: <Navigate to="https://dmm.chint.com/front/development/view/c0766e737b554e6eab7196676f410c40$$0$$fd3e94c07c40492b907aea9af565528d" />
      },
   {
        path: "/topotest",
        element: <Topologytest />
    },
    {
      path:"/detailIndicators",
      element:<DetailIndicators/>
    },
    {
      path: "/index/runtimeDistribution/statements/:loopname",
      element: <Loopname />
    },
    {
      path: "/diskchart",
      element: <Diskchart />
    },
   {
    path: '*',
    element:   <Notfound />
   }
  
];
 
const getNestRout = (sider,routes) => {   
  let menus = []
  if (Array.isArray(sider) && sider.length > 0) {        
    sider.forEach(r => {
      // /console.log(r,routes)
      let {no, key, label} = r;
      let Com =routes ? routes[no] : Emptycom;     
      if (Com) menus.push({path: key, element: <Com pagename={label} />}) 
     })
  } 
  return menus
}
function useRoute() { // 重写路由
  RunRoute = [{
    path: '',
    element: <Notfound />
   }];
   DesignerRoute = [{
    path: '',
    element: <Notfound />
   }]; 
  const {runMenus, designerMenus, siderDesignerMenus, siderRunMenus } = useSelector(Menus) || {} // 登录页面时会报错
  const bigScreen = useSelector(currentscreen) || {}
   
  runMenus?.forEach(r => {    
    let {no, key} = r;   
    let Com = components[no];
    let nestroute = runRoutes[key]    
    let sider = siderRunMenus[key]  // runtimeCarbonEmissionManager 碳排管理    
    if (Com) {
      no == '0104' ? RunRoute.push({
        path: key,
        index: true,
        element: <Defauthome/>, // 项目概述
        state: {index: true}
      }) : RunRoute.push( {
        path: key, 
        element: <Com><Navigate to={siderRunMenus[key]?.[0]?.key} replace={true}></Navigate> </Com>, 
        children: getNestRout(sider, nestroute)
      })
    }
  }) 
  
  designerMenus?.forEach(r => {
    let {no, key} = r;//0212 quota 
    let Com = designerComponents[no];
    let nestroute = designerRoutes[key]
    let sider = siderDesignerMenus[key]
    if (Com) {
     no == '0202' ?  DesignerRoute.push( {
      path: key, 
      element: <Project />, // 项目概述
    }) : DesignerRoute.push( {
        path: key, 
        element: <Com><Navigate to={siderDesignerMenus[key]?.[0]?.key} replace={true}></Navigate> </Com>, 
        children: getNestRout(sider, nestroute)
      })
    }
   
  }) 
  
  RunRoute.push( {
    path: '/index/*',
    element: <Notfound />
   })
   DesignerRoute.push({
    path: '/config/*',
    element: <Notfound />
   })
  routes[2].children = RunRoute ;  
  routes[3].children = DesignerRoute;   
  const {type, key, primary} = bigScreen
  if (type == 1 && key) {
      let path = primary + key
      let nav = {
       path: `${path}`,
       element: lazyLoad(path)
      }       
      routes.push(nav)
  }
}

const EL = () => {
 useRoute()
 return useRoutes(routes)
}
export default EL
// 路由导航守卫