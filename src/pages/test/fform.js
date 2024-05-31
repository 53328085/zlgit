 
 import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useParamPostMutation, useGetPostQuery,selectUsersResult} from './apiSlice'
import { Area, ProjectList,ProjectSetting, BigScreen, eneryShift, Monitoring} from "@api/api.js"; 
import {getWebsiteMenu, menuAdd, addMany, removeOne,selectIds } from "@redux/reduxTest"
import {useSubIndustryListQuery, carbonSlice} from "@redux/carbon.js"
const Com1 =() => {
    
  const dispatch = useDispatch()
  const menus = useSelector(state => state.zltest);
  console.log(selectIds)
  const ids = selectIds(menus);
  console.log(ids)
  const mual = async () => {
    try {
       dispatch(getWebsiteMenu(1))
    } catch (error) {
      console.log(error)
    }

  }
  const add =() => {
    dispatch(removeOne({no:'zhuzl'}))
    //dispatch(addMany([{no: 'zjxzl', label: 'z虚拟菜单', key: 's',languageName: 'cn'}, {no: 'fuzl', label: 'f虚拟菜单', key: 'fd',languageName: 'cn'}]))
  }
  return <div>
    <h1>Com1</h1>
     
    <button onClick={mual}>手动更新</button>
    <button onClick={add}>增加多条数据</button>
    </div>
}
const Com2 =() => {
  let {data} = useSubIndustryListQuery('0010', {refetchOnFocus: true})
  console.log('com2')
  const dispatch = useDispatch()

  const reget = () => {
    try {
      dispatch(carbonSlice.endpoints.subIndustryList.initiate('0010',  { subscribe: false, forceRefetch: true }))
    } catch (error) {
      console.log(error)
    }
    
  }
  return <div>
    <h1>Com2</h1>
    <button onClick={reget}>initialte</button>
   
    </div>
}
const Com3 =() => {
  let {data} = useSubIndustryListQuery('0010')
  return <div><h1>Com3</h1></div>
}
const Com4 =() => {
  let {data} = useSubIndustryListQuery('0010')
  console.log('com4', data)
  return <div><h1>Com4</h1></div>
}
export default function Index() {
 
  return (
    <div>
        <Com1 /> 
        <Com2 />
        <Com3 />
        <Com4 />
    </div>
  )
}
 