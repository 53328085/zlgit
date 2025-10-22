 
import {useEffect} from "react"
import {useSelector} from 'react-redux'
import enUS from 'antd/es/locale/en_US'; // 国际化时使用
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
 //import darkTheme from  './assets/css/darkTheme.less'
moment.locale('zhCN');
 
import {ConfigProvider} from 'antd'
import {themeColor,adaptation, intl, dark} from "@redux/systemconfig";
 

export default function CustConfig(props) {
  const theme = useSelector(themeColor)
  const  isdark = useSelector(dark)
  console.log("isdark",isdark)
  const {laptop} = useSelector(adaptation) || {}
  const {lang} = useSelector(intl)
 
  const config = {
    csp: {
      nonce: 'YourNonceCode'
    },
    locale: lang,
    input: {autoComplete: "off"} ,
    space: laptop ? "small" : "middle",
  //  componentSize: laptop ? "small" : "middle", //form表单small
    form: {
      required: "'${label}' 是必选字段",
    }
  }
 useEffect(() => {
  let darktheme
  if(!isdark){
    darktheme=null
    ConfigProvider.config({
      theme , 
     // algorithm: darkTheme,
       
     }
     )
  }else {
    darktheme = import("./assets/css/darkTheme.less")
    ConfigProvider.config({ 
      algorithm: darktheme, 
     }
     )
  }

},[theme, isdark])

  
   return (
   <ConfigProvider {...config}>
     {props.children}
   </ConfigProvider>
   )
 
}
