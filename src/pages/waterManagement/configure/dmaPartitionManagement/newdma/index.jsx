import React, {useMemo, useState} from 'react'
import {CustButton, CustButtonT} from "@com/useButton"
import Pagecount from '@com/pagecontent'
import {useLocation, useNavigate} from "react-router-dom"
import {Newcontent} from "../style"
import {tabs} from "../data"
import CustContext from '@com/content.js'
import Record from "./record"
import Alarm from './alarm'
import Device from "./device"
export default function index({addDma, projectId}) {
  const [value, setvalue] = useState("1")
  const {search,pathname, state} = useLocation()
  const navigate = useNavigate()
  const id =  new URLSearchParams(search)?.get?.("id")  
  const dataProps ={
    value,
    setvalue,
    tabs
  }
  const onBack =()=> {
    navigate(pathname+"#list", { state, replace: true });
  }
  let Com = useMemo(
    ()=> {
      return {
        "1": Record,
        "2": Device,
        "3": Alarm
      }[value] || <div>开发中……</div>
    }, [value])
  return (
    <Newcontent>
     <div className="up">
       <div className="title">
          新建分区
       </div>
        <CustButtonT text="back" onClick={()=>onBack() }></CustButtonT>
     </div>
    <CustContext.Provider value={dataProps}>
    <Pagecount showSearch={false}>
      <div className="content">
      <Com projectId={projectId} id={id} />
      </div>
    </Pagecount>

    </CustContext.Provider>

    </Newcontent>
  )
}
