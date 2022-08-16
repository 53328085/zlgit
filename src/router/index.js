import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import {useSelector} from 'react-redux'
import {selectUser} from '@redux/user'
import monitoringRoutes from "./monitoring";
const Login = lazy(() => import("../pages/Login"))
const Index = lazy(() => import("../pages/Home/Index"))
const Defauthome = lazy(() => import("../pages/defauthome"))
const Monitoring = lazy(() => import("../pages/monitoring/index"))
const Antdconfig = lazy(() => import("../pages/Antcutom"))
const loginrouter =  [{
  path: "/login",
  element: <Login />
  }]
  export const LoginRouter = () => useRoutes(loginrouter)

 function Redirect() { // 路由守卫
  const {token} = useSelector(selectUser);
  return token ? (<Index/>) : (<Navigate to="/login" />)
  
 }
const routes =  [
   {
    path: "/login",
    element: <Login />
    },
    {
      path: "/",
      element: <Redirect />,
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
        }
      ]
    },
    {
      path: '/config',
      element: <Antdconfig/>
    }
   
];
const EL = () => useRoutes(routes)
export default EL
// 路由导航守卫