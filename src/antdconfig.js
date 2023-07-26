import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import {ConfigProvider} from 'antd'
const deftheme = {
    primaryColor: '#237AE4',
    errorColor: '#ff4d4f',
    warningColor: '#faad14',
    successColor: '#52c41a',
    infoColor: '#1890ff',
  }
let config = {
    componentSize: 'middle',
    nonce: 'YourNonceCode',
   
    theme: {
       ...deftheme
    },
    locale: zhCN,
}
ConfigProvider.config({
   theme: {
     primaryColor: '#237AE4',
   },
   locale: zhCN
})

export default ConfigProvider
 