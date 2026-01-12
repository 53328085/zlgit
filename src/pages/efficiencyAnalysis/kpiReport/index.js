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

import { useQueryEquipmentType, useDetail } from "./api.js";

import { Mainwrap, Clist } from "./style";
 
import { useAntdTable, useRequest } from "ahooks";
 
 

export default function Index() {
  const [form] = Form.useForm();
 // const [params, setexparams] = useState({})
  // const [areaName, setAreaName] = useState()
  const projectId = useSelector(selectProjectId)
  const mrgb = useSelector(MRGB)
  const [list, setList] = useState([])
  
  const [explains, setExplains] = useState([])
  const [equipment, setEquipment]=useState({})
  const  storeRef = useRef()
  const title = equipment?.equipmentTypeName
  const cols = useMemo(() => { 
    const {tableColumns} = isObject(equipment) ? equipment  : {}
    if (Array.isArray(tableColumns) && tableColumns.length) {
      return tableColumns.map((item, index) => ({
        title: item.columnName,
        dataIndex: item.columnKey,
        key: item.columnKey,
      }))

    }
    return []
  }, [equipment])
 const setexparams = (params) => {
     console.log("params")
     console.log(params)
  }
 
  const props = {
    config:{isdate: true,shiftNo:true},
    setexparams,
     
    //setAreaName,
  };
  const getDetail = async ({ current, pageSize }) => {
    try {
      if (!(Number.isInteger(projectId) )) {
        return {
          list: [],
          total: 0
        }
      }
      let { data, success, total } = await useDetail({}, { projectId,   pageNum: current, pageSize })
      if (success && Array.isArray(data) && data.length) {
        setExplains(Array.isArray(data[0].senceDes) ? data[0].senceDes : [])
        return {
          list: Array.isArray(data[0].streetLightInfo) ? data[0].streetLightInfo : [],
          total
        }
      } else {
        setExplains([])
        return {
          list: [],
          total
        }

      }
    } catch (error) {

    }
  }

  const { tableProps } = useAntdTable(getDetail, {
    pageSize: 14,
    refreshDeps: [projectId]
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
                <UserTable columns={cols} {...tableProps} ></UserTable>   
                </div>
              </div>
          </Titlelayout>
        </div>
         
      </Mainwrap>
    </Pagecount>
  );
}
