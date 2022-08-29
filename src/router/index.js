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
const Test = lazy(() => import("../pages/test"))
const List = lazy(() => import("../pages/test/list"))
const Fform = lazy(() => import("../pages/test/fform.tsx"))
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
    path: "/",
    element: <Login />
    },
    {
      path: "/index",
      element: <Redirect />,
       // element: <Index />,
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
    },
    {
      path: '/test',
      element: <Test/>
    },
    {
      path: '/list',
      element: <List/>
    },
    {
      path: '/form',
      element: <Fform/>
    }
   
];
const EL = () => useRoutes(routes)
export default EL
// 路由导航守卫