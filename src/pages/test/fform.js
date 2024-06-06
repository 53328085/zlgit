 
 import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useParamPostMutation, useGetPostQuery,selectUsersResult} from './apiSlice'
import { Area, ProjectList,ProjectSetting, BigScreen, eneryShift, Monitoring} from "@api/api.js"; 
import {getWebsiteMenu, menuAdd, addMany, removeOne,selectIds,selectAll, selectById, allmenus} from "@redux/reduxTest"
import {useSubIndustryListQuery, carbonSlice} from "@redux/carbon.js"
import {CustTransO, i18warning, i18t} from "@com/useButton"

const Com1 =() => {
  let {data} = useSubIndustryListQuery('0010', {refetchOnMountOrArgChange: 5}) 
  const dispatch = useDispatch()
 
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
      <CustTransO ns="comm" text="intlNumber" val={100000} />
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
   const [iscom1, setIscom1] = useState(true)
   const ids =  useSelector(selectIds)
   
   const all = useSelector(selectAll)
   const id = useSelector(state => selectById(state, '011007'))

   const menuses = useSelector(allmenus)
   console.log(menuses)
  return (
    <div>
       <button >selectIds</button>
      {  iscom1 && <Com1 /> }
        <Com2 />
        <Com3 />
        <Com4 />
    </div>
  )
}
 