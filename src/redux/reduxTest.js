import {createAsyncThunk, createSlice, createEntityAdapter} from "@reduxjs/toolkit"
import { Area, ProjectList,ProjectSetting, BigScreen, eneryShift, Monitoring} from "@api/api.js"; 
const menusAdapter = createEntityAdapter()
const initialState = menusAdapter.getInitialState()
export const getWebsiteMenu = createAsyncThunk(
  "zltest/getMenu",
  async (id, {rejectWithValue}) => {
     try {
      let {data, success, errMsg} = await ProjectList.QueryMenus(id)
      if(success) {
         return data
        
         
      }else {
        rejectWithValue(errMsg)
      }
      } catch (error) {
        //console.log(error)
        return rejectWithValue(error)
     }
  }
)
const zltest = createSlice({
  name: "zltest",
  initialState,
  reducers: {
    addMenu: menusAdapter.addOne,
    showlist: (state) => {
      console.dir(state)
    }
  },
  extraReducers: {
    [getWebsiteMenu.fulfilled]:  (state, {payload}) => {
      console.log(payload)
      menusAdapter.updateMany(payload)
    }
  }
})
export const {addMenu, showlist} = zltest.actions
console.log(zltest.actions.addMenu())
export default zltest.reducer
export const { selectAll,selectById} = menusAdapter.getSelectors(state => state.zltest)