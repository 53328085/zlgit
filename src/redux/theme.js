import { createSlice} from '@reduxjs/toolkit'
import zhCN from 'antd/es/locale/zh_CN'
const initialState = {
  theme: {
    primaryColor: '#237AE4',
    errorColor: '#ff4d4f',
    warningColor: '#faad14',
    successColor: '#52c41a',
    infoColor: '#1890ff',
  },
  componentSize: 'large',
  locale: zhCN,
  componentSize: 'middle',
  nonce: 'YourNonceCode',
}

const theme = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThem: (state, action) => {
            return Object.assign({}, state, action.payload)
        }
    },
})
const {actions, reducer} = theme
export const {setThem} =  actions
 
export default reducer
