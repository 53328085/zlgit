 
import {useSelector} from 'react-redux'
import enUS from 'antd/es/locale/en_US'; // 国际化时使用
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
 
moment.locale('zhCN');
 
import {ConfigProvider} from 'antd'
import {themeColor} from "@redux/systemconfig";

export default function CustConfig(props) {
  const primaryColor = useSelector(themeColor)
  const config = {
    csp: {
      nonce: 'YourNonceCode'
    },
    locale: zhCN,
  }
  ConfigProvider.config({
    theme: {
      primaryColor
    }, 
  }
  )
  
   return (
   <ConfigProvider {...config}>
     {props.children}
   </ConfigProvider>
   )
 
}
