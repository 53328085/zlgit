import { createSlice,nanoid, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import zhCN from 'antd/es/locale/zh_CN'
const initialState = {
    areaParams: { // 园区、建筑、楼层、状态、类型
      BuildingId: 0,
      FloorId: 0,
      RegionId: 1,
      State: '',
      Type: ''
    },
    model: true // 表格/列表 模式
}

const params = createSlice({
    name: 'params',
    initialState,
    reducers: {
        onAreaParams: (state, action) => {
            console.log('params')
            return Object.assign({}, state, action.payload)
        },
        onModel: (state, action) => {
            return Object.assign({}, state, {model: action.payload})
        }
    },
})
const {reducer, actions} = params
export const selectArea = state => state.params.areaParams
export const {onAreaParams, onModel} = actions


export default reducer
