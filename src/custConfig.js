 
import {useSelector} from 'react-redux'
import enUS from 'antd/es/locale/en_US'; // 国际化时使用
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
 
moment.locale('zhCN');
 
import {ConfigProvider} from 'antd'
import {themeColor,adaptation, intl} from "@redux/systemconfig";
 

export default function CustConfig(props) {
  const theme = useSelector(themeColor)
  const {laptop} = useSelector(adaptation)
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
  ConfigProvider.config({
    theme , 
  }
  )
  
   return (
   <ConfigProvider {...config}>
     {props.children}
   </ConfigProvider>
   )
 
}
