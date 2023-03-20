import { lazy, Suspense } from "react";
import { Navigate, useRoutes, useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux'
import {selectUser} from '@redux/user'
import store from '@redux/store'
import monitoringRoutes from "./monitoring"; // 运行监控
import energyRoutes from "./energy"; // 能源管理
import devopsRoutes from './devops'; // 运维管理
import electricRoutes from "./electric"; // 电气安全
import distributionRoutes from "./distribution"; // 配电管理
import prepaymentRoutes from "./prepayment"; // 结算收费
import photovoltaicRoutes from "./photovoltaic"; // 光伏
import moduleRoutes from "./designer/common";
import carbonRoutes from "./carbon" // 碳排管理
import storageRoutes from './storage' // 储能管理
const Login = lazy(() => import("@pages/Login"))

const Projectlist = lazy(() => import("@pages/projectList"))

const Index = lazy(() => import("@pages/Home"))

const Defauthome = lazy(() => import("../pages/defauthome"))
const Project = lazy(() => import("@pages/defauthome/configure"))
//const Module = lazy(() => import("../pages/module/index"))

const Monitoring = lazy(() => import("../pages/monitoring/index"))

const Electric = lazy(() => import("../pages/electric/index"))

const Distribution = lazy(() => import("../pages/distribution/index"))


const Energy = lazy(() => import("../pages/energy/index"))

const Devops = lazy(() => import("../pages/devops/index"))

const Prepayment = lazy(() => import("../pages/prepayment/index"))
const Carbon = lazy(() => import("../pages/carbon/index"))
const Photovoltaic = lazy(() => import("../pages/photovoltaic/index"))

const Storage = lazy(() => import("../pages/storage/index"))

const Antdconfig = lazy(() => import("../pages/Antcutom"))

const RoomDetail = lazy(() => import("../pages/roomDetail"))

const Topology = lazy(() => import("../pages/topology"))

const Devicedetail = lazy(() => import("../pages/electric/devicedetail/devicedetail"))
const DeviceDetail = lazy(() => import("../pages/monitoring/gateway/deviceDetail"))
const GatewayDetail = lazy(() => import("../pages/monitoring/gateway/gatewayDetail"))
const Fform = lazy(() => import("../pages/test/fform.js"))
const Notfound = lazy(() => import("./notfound"))
import {designerComponents, designerChildrenRoute} from "./designer";

const loginrouter =  [{
  path: "/login",
  element: <Login />
  }]
 export const LoginRouter = () => useRoutes(loginrouter)
 function Redirect() { // 路由守卫
  const {token} = useSelector(selectUser); 
  return token ? (<Projectlist/>) : (<Navigate to="/" />)  
 }

 const components = {
  '0104': Defauthome,
  '0105': Monitoring,
  '0106': Electric,
  '0107': Distribution,
  '0108': Prepayment,
  '0109': Energy,
  '0110': Photovoltaic,
  '0111': Storage,
  '0112': Carbon,
  '0113': Devops,
} 
const childrenRoute = {
  '0105': monitoringRoutes,
  '0106': electricRoutes,
  '0107': distributionRoutes,
  '0108': prepaymentRoutes,
  '0109': energyRoutes,
  '0110': photovoltaicRoutes,
  '0111': storageRoutes,
  '0112': carbonRoutes,
  '0113': devopsRoutes,
}
//console.log(runMenus)
 let RunRoute = [];
 let DesignerRoute = [];
 let routes =  [
  {
   path: "/",
   element: <Login />,   
   },
   {
     path: "/projectList",
     element: <Redirect />
   },

 

   // 进入项目

   {
     path: "/index", 
     element: <Index />,
     children: [],
     key: 'run'
   },
   // 配置项目
   {
     path: "/config",
     element: <Index />,
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
    element: <Devicedetail />
  },
  {
    path: '/devicedtl',
    element: <Devicedetail />
  },
  {
    path: '/gatewayDetail',
    element: <GatewayDetail />
  },

   {
     path: '/antdconfig',
     element: <Antdconfig/>
   },   
   {
     path: '/zltest',
     element: <Fform/>,
     loader: async ({ params }) => {
       // console.log(params)
     },

   },
   {
    path: '*',
    element: <Notfound />
   }
  
];
 
store.subscribe(() => {
  try {
   RunRoute = [{
    path: '',
    element: <Notfound />
   }];
   DesignerRoute = [{
    path: '',
    element: <Notfound />
   }];
   const menus  = store.getState().system.menus;
   
   const {runMenus, designerMenus, siderDesignerMenus, siderRunMenus } = menus;
   
   runMenus?.forEach(r => {
      let {no, key} = r;
      let Com = components[no];
      if (Com) {
        no == '0104' ? RunRoute.push({
          path: key,
          index: true,
          element: <Defauthome/>, // 项目概述
          state: {index: true}
        }) : RunRoute.push( {
          path: key, 
          element: <Com><Navigate to={siderRunMenus[key]?.[0]?.key} replace={true}></Navigate> </Com>, 
          children: childrenRoute[no]
        })
      }
     
    })
    designerMenus?.forEach(r => {
      let {no, key} = r;
      let Com = designerComponents[no];
      if (Com) {
       no == '0202' ?  DesignerRoute.push( {
        path: key, 
        element: <Project />, // 项目概述
      }) : DesignerRoute.push( {
          path: key, 
          element: <Com><Navigate to={siderDesignerMenus[key]?.[0]?.key} replace={true}></Navigate> </Com>, 
          children: designerChildrenRoute[no]
        })
      }
     
    }) 
    
    routes[2].children = RunRoute ;  
    routes[3].children = DesignerRoute; 
  } catch (error) {
    console.log(error);
  }
 

 })
 
const EL = () => useRoutes(routes)
export default EL
// 路由导航守卫