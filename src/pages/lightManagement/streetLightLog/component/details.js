import React, {useRef, forwardRef,useImperativeHandle,useState, useMemo,useEffect} from 'react'
import {Space, message, Button, Form, Select, Row, Col} from "antd"
 

import CModal from '@com/useModal'
import {useAntdTable} from "ahooks"
import UserTable from "@com/useTable";
import {CustButton} from "@com/useButton"
import {isObject} from "@com/usehandler.js"
 
import { usePageAutoDetails } from "../api.js";
import {lightcol} from "../data.js"
import {Detail} from "../style.js"
export default forwardRef(function Index({projectId}, ref){
   
  const mRef = useRef()
  const [param, setParam] = useState()
 
  const title = useMemo(()=> {
    if(Number.isInteger(parseInt(param?.result))) {
        return ["控制路灯明细","控制成功路灯明细","控制失败路灯明细"][param.result]
    }else {
        return ""
    }
  }, [param?.result])
 
 
  const getDetails = async ({current, pageSize} )=> {
    let fag = Number.isInteger(parseInt(projectId))&&isObject(param)
    if(!fag) return Promise.reject()
    const {result, id} = param
    try {
      let body = {
        projectId,
        id,
        result,
        pageSize,
        pageNum:current,
        
      }
  
     let {success, data, total,errMsg}  = await  usePageAutoDetails({}, body)
     if(success && Array.isArray(data?.streetLightInfos)) {
        return {
          list: data?.streetLightInfos,
          total: Number.isInteger(total) ? total : 0
        }
     }else {
       if(!success) message.warning(errMsg || "数据出错")
        return {
          list:[],
          total: 0
        }
     }
    
    } catch (error) {
      console.log(error)
    }

  }

 
const  {tableProps} = useAntdTable(getDetails, {
    defaultPageSize: 14,
    refreshDeps: [param, projectId],
    onSuccess: ()=> {
        mRef.current.onOpen()
    }
  })
 

 
  const onOpen =async (rest)=> {
    try {
        setParam(rest)
    //  run({current:1, pageSize: 14})
    //  runed({current:1, pageSize: 14})
     // mRef.current.onOpen()
    } catch (error) {
      console.log(error)
    }

  }

 
 const onCancel=()=> {
    setParam(null)
    mRef.current.onCancel()
 }
  


 
  useImperativeHandle(ref, ()=> ({
    onOpen,
  }))
  return (
          <CModal title={title}    width={1380} mold="cust" onCancel={onCancel}   ref={mRef} closable footer={null} >
            <Detail>
         {/*    <div className='contrl'>
                <CustButton >重新绑定</CustButton>
            </div> */}
            <UserTable columns={lightcol}  {...tableProps}    ></UserTable>    
            </Detail>         
           </CModal>   
  )
})
