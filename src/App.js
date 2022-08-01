import React, {Suspense} from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  Link,
  useRoutes,
  
} from 'react-router-dom'
import routes from './router'
import Loading from './components/Loading'
function App() {
  const linkactive = ({isActive}) => isActive ? 'linkactive' : ''

  const EL = () => useRoutes(routes) // 路由表
  let info = JSON.stringify({name: 'zzl', age: 44})
  localStorage.setItem("userInfo", info)
  return (
    <BrowserRouter>
      <div className="App">
        <div>
          {/* 路由连接 */}
          <NavLink to="/" className={linkactive}>登录页</NavLink>
          <NavLink to="/Home" end className={linkactive}>首页</NavLink>
          <NavLink to="/project">
          {({ isActive }) => (
              <span
                className={
                  isActive ? 'activeClassName' : undefined
                }
              >
                项目管理
              </span>
            )}
          </NavLink>
          <NavLink to="/news/12" end className={linkactive}>新闻</NavLink>
          <NavLink to="/usedome" end className={linkactive}>UseDome</NavLink>
          <NavLink to="/dome" end className={linkactive}>dome</NavLink>
          <NavLink to="/renderprop" end className={linkactive}>RenderProp</NavLink>
        </div>
        <div> 
          <Suspense fallback={<Loading/>}>
          <EL/>
          </Suspense>
          {/*  <Routes>
              <Route 
                 path="/login"
                 element={<Login/>}
              />
               <Route 
                 path="/home"
                 element={<Home/>}
              />
               <Route 
                 path="/"
                 element={<Navigate to='/login' />}
              />
           </Routes> */}
      
         </div>
      </div>
    </BrowserRouter>
  )
}

export default App
