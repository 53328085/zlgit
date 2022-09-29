import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import {useSelector} from 'react-redux'
import {selectUser} from '@redux/user'
import monitoringRoutes from "./monitoring";
import energyRoutes from "./energy";
import devopsRoutes from './devops'
import electricRoutes from "./electric";
import distributionRoutes from "./distribution";
import prepaymentRoutes from "./prepayment";
import photovoltaicRoutes from "./photovoltaic";
import moduleRoutes from "./module";
import carbonRoutes from "./carbon"
const Login = lazy(() => import("../pages/Login"))
const Projectlist = lazy(() => import("../pages/projectList"))
const Index = lazy(() => import("../pages/Home/Index"))
const Defauthome = lazy(() => import("../pages/defauthome"))
const Module = lazy(() => import("../pages/module/index"))
const Monitoring = lazy(() => import("../pages/monitoring/index"))
const Electric = lazy(() => import("../pages/electric/index"))
const Distribution = lazy(() => import("../pages/distribution/index"))
const Energy = lazy(() => import("../pages/energy/index"))
const Devops = lazy(() => import("../pages/devops/index"))
const Prepayment = lazy(() => import("../pages/prepayment/index"))
const Photovoltaic = lazy(() => import("../pages/photovoltaic/index"))
const Carbon = lazy(() => import("../pages/carbon/index"))
const Antdconfig = lazy(() => import("../pages/Antcutom"))
const RoomDetail = lazy(() => import("../pages/roomDetail"))
const Fform = lazy(() => import("../pages/test/fform.js"))
const loginrouter =  [{
  path: "/login",
  element: <Login />
  }]
 export const LoginRouter = () => useRoutes(loginrouter)

 function Redirect() { // 路由守卫
  const {token} = useSelector(selectUser);
  return token ? (<Projectlist/>) : (<Navigate to="/" />)
  
 }
const routes =  [
   {
    path: "/",
    element: <Login />
    },
    {
      path: "/projectList",
      element: <Redirect />
    },
    {
      path: "/index",
      //element: <Redirect />,
      element: <Index />,
      children: [
        {
          index: true,
          element: <Defauthome/>, //默认首页
          state: {index: true}
        },
        {
          path: 'monitoring', // 运行监控
          element: <Monitoring><Navigate to='outline' replace={true}></Navigate> </Monitoring>, 
          children: monitoringRoutes
        },
        {
          path: 'electric', // 电气安全
          element: <Electric><Navigate to='safe' replace={true}></Navigate> </Electric>, 
          children: electricRoutes
        },
        {
          path: 'distribution', // 配电管理
          element: <Distribution><Navigate to='summary' replace={true}></Navigate> </Distribution>, 
          children: distributionRoutes
        },
        {
          path: 'energy', // 能源管理
          element: <Energy><Navigate to='summary' replace={true}></Navigate> </Energy>, 
          children: energyRoutes
        },
        {
          path: 'devops', // 运维管理管理
          element: <Devops><Navigate to='summary' replace={true}></Navigate> </Devops>, 
          children: devopsRoutes
        },
        {
          path: 'prepayment', // 结算收费
          element: <Prepayment><Navigate to='summary' replace={true}></Navigate> </Prepayment>, 
          children: prepaymentRoutes
        },
        {
          path: 'photovoltaic', // 光伏发电
          element: <Photovoltaic><Navigate to='summary' replace={true}></Navigate> </Photovoltaic>, 
          children: photovoltaicRoutes
        },
        {
          path: 'carbon', // 碳排管理
          element: <Carbon><Navigate to='monitor' replace={true}></Navigate></Carbon>, 
          children: carbonRoutes
        },
        {
          path: 'module', // 公共模块
          element: <Module><Navigate to='project' replace={true}></Navigate></Module>, 
          children: moduleRoutes
        }
      ]
    },
    {
      path: "/roomDetail",
      element: <RoomDetail />
    },
    {
      path: '/config',
      element: <Antdconfig/>
    },   
    {
      path: '/form',
      element: <Fform/>
    }
   
];
const EL = () => useRoutes(routes)
export default EL
// 路由导航守卫