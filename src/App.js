import React, {Suspense,useEffect} from 'react'
import {BrowserRouter,useNavigate} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import enUS from 'antd/es/locale/en_US'; // 国际化时使用
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
 
moment.locale('zhCN');

import Loading from './pages/Loading';
import EL from './router'
import ErrorBoundary from './ErrorBoundary';
//import useConfig from './antdconfig';\
import {ConfigProvider} from 'antd'
import {themeColor} from "@redux/systemconfig";
import CustConfig from './custConfig';
import { clearToken} from "@redux/user";
function App() {
  const dispatch = useDispatch()
  const navgite = useNavigate()
  const primaryColor = useSelector(themeColor)
  const config = {
    csp: {
      nonce: 'YourNonceCode'
    },
    locale: zhCN,
  }
  ConfigProvider.config({
    theme: {
      primaryColor: "#237ae4"
    }
  }
  )
 useEffect(()=>{
  return ()=>{
    dispatch(clearToken()) 
  }
 },[])
  return   (
    <CustConfig>
    <ErrorBoundary>
  <BrowserRouter>
    <Suspense fallback={<Loading/>}>  
         <EL/>
        
    </Suspense>  
    </BrowserRouter>
    </ErrorBoundary>
    </CustConfig>
    ) 
  

  }

export default App
