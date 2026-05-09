 
import {useEffect} from "react"
import {useSelector} from 'react-redux'
import enUS from 'antd/locale/en_US'; // 国际化时使用
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/zh-cn';
dayjs.extend(weekday);
dayjs.extend(localeData)
 
dayjs.locale('zh-cn');
 
import {ConfigProvider} from 'antd'
import {themeColor,adaptation, intl, dark} from "@redux/systemconfig";
 

export default function CustConfig(props) {
  const theme = useSelector(themeColor)
  console.log("theme",theme)
  const  isdark = useSelector(dark)
  console.log("isdark",isdark)
  const {laptop} = useSelector(adaptation) || {}
  const {lang} = useSelector(intl)
  console.log("lang",zhCN)
  const config = {
    csp: {
      nonce: 'YourNonceCode'
    },
    locale: {
      ...lang,
     //  shortWeekDays: ['日', '一', '二', '三', '四', '五', '六'],
    //   shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    },
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
   <ConfigProvider {...config} locale={zhCN}>
     {props.children}
   </ConfigProvider>
   )
 
}
