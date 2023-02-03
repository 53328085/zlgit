import { lazy } from "react";
import { Navigate } from "react-router-dom";
const Index = lazy(() => import("@pages/Home/index"))
const Module = lazy(() => import("@pages/module/index")) 
const Monitoring = lazy(() => import("@pages/monitoring/configure/index")) 
import moduleRoutes from "./module";
import Defauthome from "@pages/defauthome/configure"
import monitoringRoutes from "./monitoring"
 export default  [
    {
      path: "/config",
      element: <Index />,
      children: [
        {
          path: 'module', // 公共模块
          element: <Module><Navigate to='project' replace={true}></Navigate></Module>, 
          children: moduleRoutes
        },
        {
          path: 'summary',
          element: <Defauthome/>
        },       
        {
            path: 'monitoring', // 运行监控
            element: <Monitoring><Navigate to='device' replace={true}></Navigate> </Monitoring>, 
            children: monitoringRoutes
         },
       
      ]
    }, 
];
 