 
 import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useParamPostMutation, useGetPostQuery,selectUsersResult, useGetAreaQuery} from './apiSlice'
import { Area, ProjectList,ProjectSetting, BigScreen, eneryShift, Monitoring} from "@api/api.js"; 
import {getWebsiteMenu, menuAdd, addMany, removeOne,selectIds,selectAll, selectById, allmenus} from "@redux/reduxTest"
import {useSubIndustryListQuery, useSaveItemsMutation, carbonSlice} from "@redux/carbon.js"
import {CustTransO, i18warning, i18t} from "@com/useButton"

const Com1 =() => {
  let {data, isFetching, isLoading,error, isError} = useGetAreaQuery(2, {
    refetchOnMountOrArgChange: true,
    
    skip: false,


  }) 
  useEffect(() => {
    if(data) console.log(data)
    console.log('isEorror',isError)
    console.log('error', error)
    console.log('data',data)
  }, [data])
  const  [save, {error: saveerror}] = useSaveItemsMutation()
  const onSave =() => {
     save().unwrap().then(res => {
      console.log(res)
     }).catch(e => {
      console.log(JSON.stringify(e))
     })
  }
  return <div>
       <button onClick={onSave}>save</button>
        {JSON.stringify(saveerror)}
    </div>
}

export default function Index() {
   const [iscom1, setIscom1] = useState(true)
   const ids =  useSelector(selectIds)
   
   const all = useSelector(selectAll)
   const id = useSelector(state => selectById(state, '011007'))

   const menuses = useSelector(allmenus)
   const [skip, setSkip] = useState(true)
  
 
  return (
    <div>
       <button onClick={() => setIscom1((is) =>!is )}>{String(iscom1)}</button>
       {iscom1 && <Com1 />}
       
    </div>
  )
}
 