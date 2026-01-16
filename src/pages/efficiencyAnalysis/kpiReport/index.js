import React, { useRef, useState, useEffect, useMemo } from "react";
import { Space, Form, Select, Input, List } from "antd";
import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux"
import { selectProjectId,MRGB } from "@redux/systemconfig"
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import Comsearch from "@com/useSerach/comhead.js"
import {isObject} from "@com/usehandler.js"

//import { cols } from "./data";

import { useQueryEquipmentType, useQueryCustomReport } from "./api.js";

import { Mainwrap, Clist } from "./style";
 
import { useAntdTable, useRequest } from "ahooks";
 
 

export default function Index() {
  const [form] = Form.useForm();
   const [query, setQuery] = useState({})
  // const [areaName, setAreaName] = useState()
 // const projectId = useSelector(selectProjectId)
  const mrgb = useSelector(MRGB)
  const [list, setList] = useState([])
  
  const [explains, setExplains] = useState([])
  const [equipment, setEquipment]=useState({})
  const {projectId, publicdate, publictype,publicrangedate} = query
  const  storeRef = useRef()
  const title = equipment?.equipmentTypeName
  const [cols, key] = useMemo(() => { 
    const {tableColumns,key} = isObject(equipment) ? equipment  : {}
    if (Array.isArray(tableColumns) && tableColumns.length) {
      let len = tableColumns.length - 1
      return [tableColumns.map((item, index) => ({
        title: item.columnName,
        dataIndex: item.columnKey,
        key: item.columnKey,
        fixed: index==0 ? "left" : index==len ? "right" :false
      })), key]

    }
    return [[], NaN]
  }, [equipment])
 
  const setexparams = (q) => {
     setQuery(q)
  }  
 console.log(query)
  const props = useMemo(() => ({
    config:{publicDate: true,shiftNo:true},
    setexparams,})
     
    //setAreaName,
  ,[]);
  const getDetail = async ({ current, pageSize }) => {
    try {
      
       
      let flag = [projectId, publictype,key  ].every((d)=>Number.isInteger(parseInt(d)) )  
      let isdate = publictype == 4 ? Array.isArray(publicrangedate)&&publicrangedate?.[0]&&publicrangedate?.[1] : publicdate
     
      if (!(flag&&isdate)) {
        return {
          list: [],
          total: 0
        }
      }
    
      let post ={
         key,
         projectId,
         startDate:publictype!=4 ? publicdate?.startOf().format("YYYY-MM-DD") : publicrangedate?.[0]?.format?.("YYYY-MM-DD"),
         pageSize,
         pageNum:current,
         endDate:publictype!=4 ? publicdate?.format("YYYY-MM-DD") : publicrangedate?.[1]?.format?.("YYYY-MM-DD"),
         type:publictype
     

      }
      let { data, success, total } = await useQueryCustomReport({}, post)
      if (success && isObject(data)) {
        const {tableRows} = data
        return {
          list: Array.isArray(tableRows) ? tableRows : [],
          total
        }
      } else { 
        return {
          list: [],
          total
        }

      }
    } catch (error) {
      console.log(error)
    }
  }

  const { tableProps } = useAntdTable(getDetail, {
    pageSize: 14,
    refreshDeps: [projectId, publicdate, publictype,publicrangedate, key]
  })

  const getData = async () => {
    try {
      let { success, data, errMsg } = await useQueryEquipmentType({
        projectId, 
      });
      if (success && Array.isArray(data) && data.length) {
        setList(data)
        storeRef.current =data
        setEquipment(data[0]) 
      } else { 
        setEquipment({})
        setList([])
        storeRef.current =[]
        if (!success) {
          return Promise.reject(errMsg)
        }  

      }
    } catch (error) {
      return Promise.reject(error)
    }
  };
  useRequest(getData, {
    refreshDeps: [projectId]
  })

  const onChange = (v) => {
    setSchemeId(v.target.value)
  }
  const onSearch = (v) => {
       console.log(v)
       if(typeof v=="string" && v) {
          setList(list?.filter(e=>e.equipmentTypeName?.includes(v)))
       }else{
         setList(storeRef.current)
       }
       
  }

 const onSelect = (item) => {
  setEquipment(item)
  }

  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <Titlelayout layout="flex" title="报表列表" dr="column"  >
          <Input.Search placeholder="请输入关键字查询" allowClear onSearch={onSearch} />
          <Clist 
            MRGB={mrgb} 
          >
             {list.map((item, index) => (<div className={`item ${item.equipmentType ==equipment.equipmentType ? "active"  : ""}`}  key={item.equipmentType} tabIndex={index} onClick={()=>onSelect(item)}>{item.equipmentTypeName}</div>))}
          </Clist>
          
        </Titlelayout>
         
        <div className="right">
          <Comsearch  {...props} />
          <Titlelayout layout="flex" title={title} dr="column"> 
              <div className="outtbwrap">
                <div className="inerwrap">
                <UserTable columns={cols} {...tableProps} scroll={{
                  x:"max-content"
                }} ></UserTable>   
                </div>
              </div>
          </Titlelayout>
        </div>
         
      </Mainwrap>
    </Pagecount>
  );
}
