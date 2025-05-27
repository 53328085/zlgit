import React, {Suspense, useEffect} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
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
import {themeColor, intl,setadaptation,getThemeColor,adaptation, iszhCN} from "@redux/systemconfig";
import CustConfig from './custConfig';
import { clearToken} from "@redux/user";
import {getprimarycolors} from "@com/usehandler";
function App() {
  const dispatch = useDispatch()
  const theme = useSelector(themeColor)
  const laptop = useSelector(adaptation) || { }
  const iscn = useSelector(iszhCN)
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
  let {width, height} = window.screen
  let ratio = width / height
  let mqString =window.matchMedia(`(max-device-width:1536px)`);
 
  let ratiostr =window.matchMedia(`(device-aspect-ratio:4/3)`);
  const updatePixelRatio = (e) => {
    dispatch(setadaptation({laptop: e.matches}))
  };
 
const updateratio=(e)=>{
 
  dispatch(setadaptation({ratio43: e.matches}))
}
 
 useEffect(() => {
  

  if(width<=1536){
    dispatch(setadaptation({laptop: true}))

  }else{
    dispatch(setadaptation({laptop: false}))
  }

  dispatch(setadaptation({ratio43: ratio==(4/3)}))
 
mqString.addEventListener("change", updatePixelRatio)
ratiostr.addEventListener("change", updateratio)
 return()=>{
 mqString.removeEventListener("change", updatePixelRatio)
 ratiostr.removeEventListener("change",updateratio)
}

 }, [width, height])
 useEffect(()=> {
   /*  try {
      let primaryderiveds=  getprimarycolors().map?.(d => d.value) || []
      let primaryderived=primaryderiveds?.[5]||"#ffffff"
      dispatch(getThemeColor({primaryderived}))
    } catch (error) {
      
    } */
   
 }, [])
 
  return   (
 <CustConfig> 
    <ThemeProvider theme={{...theme, ...laptop}}>
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
