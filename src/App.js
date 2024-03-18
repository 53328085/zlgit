import React, {Suspense} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'
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
import {themeColor, intl} from "@redux/systemconfig";
import CustConfig from './custConfig';
function App() {
  const theme = useSelector(themeColor)
/*   const theme = useSelector(themeColor)
 
   
  const config = {
    csp: {
      nonce: 'YourNonceCode'
    },
    locale: zhCN,
  }
  ConfigProvider.config({
    theme: {
      primaryColor: theme.primaryColor,
    },
   
  }
  ) */
 
  return   (
 <CustConfig> 
    <ThemeProvider theme={theme}>
    <ErrorBoundary>
  <BrowserRouter>
    <Suspense fallback={<Loading/>}>  
         <EL/>
        
    </Suspense>  
    </BrowserRouter>
    </ErrorBoundary>
    </ThemeProvider>
  </CustConfig> 
    ) 
  

  }

export default App
