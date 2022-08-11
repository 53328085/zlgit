import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import monitoringRoutes from "./monitoring";
const Login = lazy(() => import("../pages/Login"))
const Index = lazy(() => import("../pages/Home/Index"))
const Defauthome = lazy(() => import("../pages/defauthome"))
const Monitoring = lazy(() => import("../pages/monitoring/index"))
const Antdconfig = lazy(() => import("../pages/Antcutom"))

const routes =  [
  {
    path: "/",
    element: <Login />
    },
    {
      path: "/index",
      element: <Index />,
      children: [
        {
          index: true,
          element: <Defauthome/> //默认首页
        },
        {
          path: 'monitoring', // 运行监控
          element: <Monitoring/>,
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