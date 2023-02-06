import { lazy, Suspense } from "react";
import { Navigate, useRoutes, useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux'
import {selectUser} from '@redux/user'
import store from '@redux/store'
import monitoringRoutes from "./monitoring"; // 运行监控
import energyRoutes from "./energy"; // 能源管理
import devopsRoutes from './devops'
import electricRoutes from "./electric"; // 电气安全
import distributionRoutes from "./distribution"; // 配电管理
import prepaymentRoutes from "./prepayment"; // 结算收费
import photovoltaicRoutes from "./photovoltaic";
import moduleRoutes from "./configure/module";
import carbonRoutes from "./carbon"
const Login = lazy(() => import("@pages/Login"))

const Projectlist = lazy(() => import("../pages/projectList"))

const Index = lazy(() => import("../pages/Home"))

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
import configure from "./configure";
const loginrouter =  [{
  path: "/login",
  element: <Login />
  }]
 export const LoginRouter = () => useRoutes(loginrouter)
 const token = 'YPOitQUwHhheEIJH0cJzdX2M6YITk9cYbr2lzrI0StM='
 function Redirect() { // 路由守卫
  //const {token} = useSelector(selectUser); // 后台问题， 暂时注释
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
  '0111': Carbon,
  '0112': Devops,
} 
const childrenRoute = {
  
  '0105': monitoringRoutes,
  '0106': electricRoutes,
  '0107': distributionRoutes,
  '0108': prepaymentRoutes,
  '0109': energyRoutes,
  '0110': Photovoltaic,
  '0111': Carbon,
  '0112': Devops,
}
//console.log(runMenus)
 const RunRoute = [];
 let routes =  [
  {
   path: "/*",
   element: <Login />,   
   },
   {
     path: "/projectList",
     element: <Redirect />
   },

 

   // 进入项目

   {
     path: "/index",
     //element: <Redirect />,
     element: <Index />,
     children: [],

   },
   {
     path: "/roomDetail",
     element: <RoomDetail />
   },
   {
     path: '/antdconfig',
     element: <Antdconfig/>
   },   
   {
     path: '/form',
     element: <Fform/>,
     loader: async ({ params }) => {
        console.log(params)
     },

   },
     //  项目配置
     ...configure,
  
];
 
store.subscribe(() => {

   const menus  = store.getState().system.menus;
   console.log(menus);
   const {runMenus, designerMenus, siderDesignerMenus, siderRunMenus } = menus;
  
  console.log(runMenus)
  console.log(siderRunMenus)
  runMenus?.forEach(r => {
      let {no, key} = r;
      let Com = components[no];
      if (Com) {
        no == '0104' ? RunRoute.push({
          path: key,
          index: true,
          element: <Defauthome/>, //默认首页
          state: {index: true}
        }) : RunRoute.push( {
          path: key, 
          element: <Com><Navigate to={siderRunMenus[key]?.[0]?.key} replace={true}></Navigate> </Com>, 
          children: childrenRoute[no]
        })
      }
     
    })
 
  try {
    routes[2].children = RunRoute;  
  } catch (error) {
    console.log(error);
  }
 

 })

const EL = () => useRoutes(routes)
export default EL
// 路由导航守卫