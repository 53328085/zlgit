import { createSlice} from '@reduxjs/toolkit'
const initialState = {
    areaParams: { // 园区、建筑、楼层、状态、类型
      BuildingId: 0,
      FloorId: 0,
      RegionId: 1,
      State: '',
      Type: ''
    },
    display: true, // 表格/列表 模式
    form: null, // form表单实例
    search: {}, // useAntdTable 返回的方法
}

const params = createSlice({
    name: 'params',
    initialState,
    reducers: {
        onAreaParams: (state, action) => {
            console.log('params')
            return Object.assign({}, state, action.payload)
        },
        onDisplay: (state, action) => {
            return Object.assign({}, state, {display: action.payload})
        },
        formInstance: (state, action) => {
            console.log(action.payload)
           // return {...state, form: action.payload}
        },
        formSerach: (state, action) => {
            return Object.assign({}, state, {serach: action.payload})
        }
    },
})
const {reducer, actions} = params
export const selectArea = state => state.params.areaParams
export const selectDisplay = state => state.params.display
export const selectSerach = state => state.params.formSerach
export const selectInstance = state => state.params.Instance
export const {onAreaParams, onDisplay, formInstance, formSerach} = actions


export default reducer
