import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import Login from "../components/Login";
import Message from "../components/Home/Message";
import News from "../components/News";
// import Wkl from "../components/Home/Wkl";
const Home = lazy(() => import("../components/Home")); // lazy()传入一个函数
const Wkl = lazy(() => import("../components/Home/Wkl"));
const Project = lazy(() => import("../components/Project"))
const NewDtl = lazy(() => import("../components/NewDtl"))
const NotFind = lazy(() => import("../components/Notfind"))
const UseDome = lazy(() => import("../components/UseDome"))
const Demo = lazy(() => import("../components/Demo"))
const RenderProp = lazy(() => import("../components/RenderProp"))
export default [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        index: true,
        element: <h1>home默认内容</h1>,
      },
      {
        path: "message",
        element: <Message />,
        children: [
          {
            path: "wkl",
            element: <Wkl />,
          },
        ],
      },
     
    ],
  },
  {
    path: "news",
    element: <News></News>,
    children: [
      {
        path: ':id',
        element: <NewDtl />,
      }

    ]
    
  },
  {
    path: '/project',
    element: <Project />
  },
  {
    path: '/usedome',
    element: <UseDome />
  },
  {
    path: '/dome',
    element: <Demo />
  },
  {
    path: '/renderprop',
    element: <RenderProp />
  },
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: '*',
    element: <NotFind />
  }
];
