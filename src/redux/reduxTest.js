import {createAsyncThunk, createSlice, createEntityAdapter, createSelector} from "@reduxjs/toolkit"
import { Area, ProjectList,ProjectSetting, BigScreen, eneryShift, Monitoring} from "@api/api.js"; 
//const menusAdapter = createEntityAdapter()
//const initialState = menusAdapter.getInitialState()
const menuAdapter = createEntityAdapter({
   selectId: (menu) => { 
    if (menu.languageName=='cn'){
       return menu.no
    }
  },
  sortComparer: (a, b) => a.key.localeCompare(b.key)
})

export const getWebsiteMenu = createAsyncThunk(
  "zltest/getMenu",
  async (id, obj) => {
     
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
  initialState: menuAdapter.getInitialState() ,
  reducers: {
    menuAdd: menuAdapter.addOne,
    addMany: menuAdapter.addMany,
    removeOne: menuAdapter.removeOne

  },
 
  extraReducers: {
    [getWebsiteMenu.fulfilled]:  (state, {payload}) => {
      console.log(payload)
      menuAdapter.setAll(state, payload)
    },
    [getWebsiteMenu.rejected]:  (state, {payload}) => {
      console.log(payload)
     // menusAdapter.updateMany(payload)
    }
  }
})
export const  {selectIds, selectAll,selectById} =menuAdapter.getSelectors(state => state.zltest)

export const allmenus = state => state.zltest.entities
export const selectByNo = state =>(no) =>   state.zltest.enties.find()
export const selectMenuById = createSelector(
  [allmenus, (state, no) => no],
  (menus, no) => menus.find(m => m.no)
)

export const {menuAdd, addMany, removeOne} = zltest.actions

export default zltest.reducer
