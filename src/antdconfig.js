import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const deftheme = {
    primaryColor: '#1890ff',
    errorColor: '#ff4d4f',
    warningColor: '#faad14',
    successColor: '#52c41a',
    infoColor: '#1890ff',
  }
export default {
    componentSize: 'middle',
    nonce: 'YourNonceCode',
    theme: deftheme,
    locale: zhCN
}