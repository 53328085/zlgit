import React, {useState, useMemo, useEffect, Suspense, useRef,} from 'react' 
import {notification  } from 'antd'
import {useRequest} from 'ahooks'
import {useSelector} from 'react-redux'
 
import {ErrorBoundary} from 'react-error-boundary'
import {DefaultLayout, ProjectLayout} from '@com/layout'
import {Fallack} from "@com/useError"
import Header from './header'
import Sider from './sider'
import {Outlet, useLocation} from 'react-router-dom'
import {  mixtitle,jump, selectProjectId,selectOneLevelDefaultId} from "@redux/systemconfig";
import Loading from '@pages/Loading';
import { Apimethod } from "@api/api.js"

import { isObject } from '@com/usehandler'
import moment from 'moment'
 
const { useQueryWarningDetails } = new Apimethod( // 成都银犁项目 警报声
  "post",
  "Safe/SafeRuntime/QueryWarningDetails"
);
 
export default function Index(props) {

   const totalRef = useRef(0)
  
   const projectId = useSelector(selectProjectId)
   
  // 成都银犁项目  全局告警提示
  //  const onclose = ()=>{
  //   try{
  //     console.log("关闭")
  //  let el =document.getElementById('audio') 
  //        el.play()
  //        el.muted = true
  //     run()
  //   } catch (error) {
  //     console.log(error)
  //   }
   
     
     
  //  }
  //  const getWarningTotal = async()=>{
  //   try {
  //      let params = { 
  //     pageNum: 1,
  //     pageSize: 10,
  //   projectId,
  //     level: 0,
  //     start: moment().format("YYYY-MM-DD"),
  //     end: moment().format("YYYY-MM-DD"),
  //   status: 1,
  //      }
  //      let {data, success, total}= await useQueryWarningDetails({},params)
  //      if (!success || !Array.isArray(data) || data?.length==0) return
      
      
      
  //     if(totalRef.current < total) {
  //          totalRef.current = total 
  //           const {sn,alarmEvent,alarmTime} = data[0]
  //        let el =document.getElementById('audio') 
        
  //        el.muted = false
          
  //          cancel()
  //          notification.error({
  //           key:"warning",
  //           message:  '告警信息',
  //           description:`${alarmTime}：${alarmEvent}, 设备SN：${sn}`, 
  //           duration:null,
  //           placement:"topRight",
  //           onClose: onclose,
  //          })
          
  //      }
         
         
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // const {run, cancel} =   useRequest(getWarningTotal, {
  //    pollingInterval: 1000*60*10,
  //    pollingErrorRetryCount: 3,
  //    manual:true
  //  })
 

  // useEffect(() => {
  //   if(Number.isInteger(parseInt(projectId))) { 
          
  //     run() 
  //   }
   
  // }, [projectId])

  let location = useLocation()
  const enchtitle = useSelector(mixtitle)
  const desin = useSelector(jump)
  //console.log("desin",desin)
  useEffect(() => {
    document.title = enchtitle+ ' ' + location.state?.title
    return () => document.title = enchtitle
  },[location])  
   
 
  let Defaultlayout = (
    <DefaultLayout       
      custheader= {<Header istitle={true}/>}
    >
      <Suspense fallback={<Loading />}>
      <ErrorBoundary FallbackComponent={Fallack}>
          <Outlet/>
      </ErrorBoundary>
    </Suspense>
   </DefaultLayout> 
  )
  let Projectlayout = (
    <ProjectLayout {...props} custheader= {<Header istitle={false}/>}  custsider={<Sider />}>
        <Suspense fallback={<Loading />}>
          <ErrorBoundary FallbackComponent={Fallack} >
            <Outlet/>
          </ErrorBoundary>
        </Suspense>
    </ProjectLayout>
  )
  return  <>{desin ? Defaultlayout : Projectlayout}</>
}
