import {createAsyncThunk, createSlice, createEntityAdapter} from "@reduxjs/toolkit"
import { Area, ProjectList,ProjectSetting, BigScreen, eneryShift, Monitoring} from "@api/api.js"; 
//const menusAdapter = createEntityAdapter()
//const initialState = menusAdapter.getInitialState()
export const getWebsiteMenu = createAsyncThunk(
  "zltest/getMenu",
  async (id, obj) => {
    console.log(obj)
    let {rejectWithValue} = obj;
     try {
      let {data, success, errMsg} = await ProjectList.QueryMenus(id)
      if(success) {
         return data
        
         
      }else {
        console.log(errMsg)
        rejectWithValue({error: '你错了'})
      }
      } catch (error) {
        console.log(error)
        //console.log(error)
        return rejectWithValue({error: 'catch里的你错了'})
     }
  }
)
const zltest = createSlice({
  name: "zltest",
  initialState: {
      menus: []
  },
  reducers: {
    
  },
 
  extraReducers: {
    [getWebsiteMenu.fulfilled]:  (state, {payload}) => {
      console.log(payload)
      menusAdapter.updateMany(payload)
    },
    [getWebsiteMenu.rejected]:  (state, {payload}) => {
      console.log(payload)
     // menusAdapter.updateMany(payload)
    }
  }
})
export const {addMenu, showlist} = zltest.actions

export default zltest.reducer
