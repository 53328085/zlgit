import { lazy } from "react";
import { Navigate } from "react-router-dom";
const Index = lazy(() => import("@pages/Home/index"))
const Module = lazy(() => import("@pages/module/index")) 
import moduleRoutes from "./module";
import Defauthome from "@pages/defauthome/indexconf.js"
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
        }
      ]
    }, 
];
 