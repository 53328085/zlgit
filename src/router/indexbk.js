import { lazy, Suspense } from "react";
import { Navigate, useRoutes, useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux'
import {selectUser} from '@redux/user'
import store from '@redux/store'
import monitoringRoutes from "./monitoring";
import energyRoutes from "./energy";
import devopsRoutes from './devops'
import electricRoutes from "./electric";
import distributionRoutes from "./distribution";
import prepaymentRoutes from "./prepayment";
import photovoltaicRoutes from "./photovoltaic";
import moduleRoutes from "./configure/module";
import carbonRoutes from "./carbon"
const Login = lazy(() => import("@pages/Login"))

const Projectlist = lazy(() => import("../pages/projectList"))

const Index = lazy(() => import("../pages/Home"))

const Defauthome = lazy(() => import("../pages/defauthome"))

const Module = lazy(() => import("../pages/module/index/index"))

const Monitoring = lazy(() => import("../pages/monitoring/index/index"))

const Electric = lazy(() => import("../pages/electric/index/index"))

const Distribution = lazy(() => import("../pages/distribution/index/index"))


const Energy = lazy(() => import("../pages/energy/index/index"))

const Devops = lazy(() => import("../pages/devops/index/index"))

const Prepayment = lazy(() => import("../pages/prepayment/index/index"))

const Photovoltaic = lazy(() => import("../pages/photovoltaic/index/index"))

const Carbon = lazy(() => import("../pages/carbon/index/index"))

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
  //const {token} = useSelector(selectUser);
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

 const childrenRoute = [];
 store.subscribe(() => {
  try {
    console.log(store)
    const sidernmen = store.getState().system.siderRunMenus
    const runmen= store.getState().system.runMenus
    console.dir(runmen)
    runmen.forEach(r => {
      let {no, key} = r;
      let Com = components[no];
      if (Com) {
        no == '0104' ? childrenRoute.push({
          index: true,
          element: <Defauthome/>, //默认首页
          state: {index: true}
        }) : childrenRoute.push( {
          path: key, // 运行监控
          element: <Com><Navigate to={sidernmen[key][0]?.key} replace={true}></Navigate> </Com>, 
          children: monitoringRoutes
        })
      }
      /* switch (no) {
        case '0104':
          childrenRoute.push({
            index: true,
            element: <Defauthome/>, //默认首页
            state: {index: true}
          })
          break;
        case "0105":
          childrenRoute.push( {
            path: key, // 运行监控
            element: <Monitoring><Navigate to={sidernmen[key][0]?.key} replace={true}></Navigate> </Monitoring>, 
            children: monitoringRoutes
          })
          break;
        case "0106":
            childrenRoute.push(  {
              path: key, // 电气安全
              element: <Electric><Navigate to={sidernmen[key][0]?.key} replace={true}></Navigate> </Electric>, 
              children: electricRoutes
            })
        break;
        case "0107":
          childrenRoute.push({
            path: key, // 配电管理
            element: <Distribution><Navigate to={sidernmen[key][0]?.key} replace={true}></Navigate> </Distribution>, 
            children: distributionRoutes
          })
        break;
        case "0108":
          childrenRoute.push({
            path: key, // 结算收费
            element: <Prepayment><Navigate to={sidernmen[key][0]?.key} replace={true}></Navigate> </Prepayment>, 
            children: prepaymentRoutes
          })
        break;
        case "0109":
          childrenRoute.push( {
            path: key, // 能源管理
            element: <Energy><Navigate to={sidernmen[key][0]?.key} replace={true}></Navigate> </Energy>, 
            children: energyRoutes
          })
        break;
        case "0110":
          childrenRoute.push({
            path: key, // 光伏发电
            element: <Photovoltaic><Navigate to={sidernmen[key][0]?.key} replace={true}></Navigate> </Photovoltaic>, 
            children: photovoltaicRoutes
          })
        break;
        case "0111":
          childrenRoute.push( {
            path: key, // 碳排管理
            element: <Carbon><Navigate to={sidernmen[key][0]?.key} replace={true}></Navigate></Carbon>, 
            children: carbonRoutes
          })
        break;
        case "0112":
          childrenRoute.push({
            path: key, // 运维管理管理
            element: <Devops><Navigate to={sidernmen[key][0]?.key} replace={true}></Navigate> </Devops>, 
            children: devopsRoutes
          },)
        break;
      } */
    })
   } catch (error) {
    
   }
 })


const routes =  [
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
       
      ]
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
const EL = () => useRoutes(routes)
export default EL
// 路由导航守卫