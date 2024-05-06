import React, { useState,useEffect } from 'react'
import {Spin, Space} from 'antd'

import { useGetPostsQuery,useParamPostMutation,apiSlice} from './apiBasic'
import {getWebsiteMenu, selectAll, showlist} from "@redux/reduxTest"
import {Selectmenus} from "@redux/systemconfig"
import {useDispatch, useSelector} from 'react-redux'
import store from "@redux/store"
const Signpost = ({id}) => {
  const data = useGetPostsQuery()
  
 

  return (
    <div>
      <h1>相同的请求接口和参数</h1>
    </div>
  )
}
export default function Index() {


 const [trigger,result, lastPromiseInfo]= apiSlice.useLazyGetPostsQuery()
 
 console.log('result', result)

 console.log('lastPromiseInfo', lastPromiseInfo)
 const dispatch = useDispatch()
 const add = async () => {
   await dispatch(getWebsiteMenu(3))
 
 }
 const show = () => {
  const all = selectAll(store.getState())
  console.dir(all);
 }
 
 const menus = useSelector(state =>Selectmenus(state, "0105"))
 console.dir(menus);

 let {isLoading, isSuccess, isError, data: Posts, refetch} = {}
 const [parampost, {isLoading: isload, isError:error, isSuccess: scc}] = useParamPostMutation()
 const [suc, setSuc] = useState()
 const getpost =async () => {
      try {
        let {success, data} = await parampost(1).unwrap()
         setSuc(success)
      } catch (err) {
        console.log(err)
      }
 }
 let content
 if(isLoading) {
   content = <Spin  tip="加载中……"/>
 }else if(isSuccess){
   content = <Signpost />
 }else if(isError){
   content =<div>页面出错</div>
 }
  return (
    <div>
      <h1>RTK Query</h1>
     
      <Space>
      <button onClick={getpost}>获取</button>
      <button onClick={() => parampost(1)}>再次获取</button>   
      <button onClick={refetch}>refetch</button>
      <button onClick={add}>Add</button>
      <button onClick={show}>Show</button>
      <button onClick={trigger}>延迟获取</button>
      </Space>
      
    </div>
  )
}
