import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import {useSelector} from 'react-redux'
import {selectUser} from '@redux/user'
import monitoringRoutes from "./monitoring";
import energyRoutes from "./energy";
const Login = lazy(() => import("../pages/Login"))
const Projectlist = lazy(() => import("../pages/projectList"))
const Index = lazy(() => import("../pages/Home/Index"))
const Defauthome = lazy(() => import("../pages/defauthome"))
const Monitoring = lazy(() => import("../pages/monitoring/index"))
const Energy = lazy(() => import("../pages/energy/index"))
const Antdconfig = lazy(() => import("../pages/Antcutom"))

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
          element: <Monitoring><Navigate to='outline' replace={true}></Navigate> </Monitoring>, // 父组件的默认子路由
          children: monitoringRoutes
        },
        {
          path: 'energy', // 能源管理
          element: <Energy><Navigate to='outline' replace={true}></Navigate> </Energy>, // 父组件的默认子路由
          children: energyRoutes
        }
      ]
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