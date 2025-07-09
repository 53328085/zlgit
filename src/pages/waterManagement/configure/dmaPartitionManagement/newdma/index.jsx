import React, {useMemo, useState} from 'react'
import {CustButton, CustButtonT} from "@com/useButton"
import Pagecount from '@com/pagecontent'
import {Newcontent} from "../style"
import {tabs} from "../data"
import CustContext from '@com/content.js'
import Record from "./record"
export default function index({addDma, projectId}) {
  const [value, setvalue] = useState("1")
  const dataProps ={
    value,
    setvalue,
    tabs
  }
  let Com = useMemo(
    ()=> {
      return {
        "1": Record,
        "2":()=> <div>开发中……</div>,
        "3":()=> <div>开发中……</div>
      }[value] || <div>开发中……</div>
    }, [value])
  return (
    <Newcontent>
     <div className="up">
       <div className="title">
          新建分区
       </div>
        <CustButtonT text="back" onClick={()=>addDma("list") }></CustButtonT>
     </div>
    <CustContext.Provider value={dataProps}>
    <Pagecount showSearch={false}>
      <div className="content">
      <Com projectId={projectId} />
      </div>
    </Pagecount>

    </CustContext.Provider>

    </Newcontent>
  )
}
