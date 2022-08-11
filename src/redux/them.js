import { createSlice,nanoid, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import zhCN from 'antd/es/locale/zh_CN'
const initialState = {
  theme: {
    primaryColor: '#1890ff',
    errorColor: '#ff4d4f',
    warningColor: '#faad14',
    successColor: '#52c41a',
    infoColor: '#1890ff',
  },
  componentSize: 'large',
  locale: zhCN
}

const theme = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setThem: (state, action) => {
            return Object.assign({}, state, action.payload)
        }
    },
})

export const {setThem} = theme.actions


export default theme.reducer
