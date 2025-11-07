import React, { useRef, useState, useEffect , useCallback} from "react";
import { Space, Form, Select, Input, Radio, Typography, List, Checkbox } from "antd";
import {PlusCircleOutlined} from "@ant-design/icons"
import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux"
import { selectProjectId,levelDefaultLabel } from "@redux/systemconfig"
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import {AreaSelect, Cform} from "@com/useSerach/comhead.js"
import {CustButtonT,CustButton, ExportExcel} from "@com/useButton" 
import CModal from '@com/useModal'
import { cols, mockopt,plainOptions } from "./data";

import { useList, useDetail } from "./api.js";

import { Mainwrap,Groupwrap } from "./style";
import{TitleBox} from "@com/comstyled"
import { useAntdTable, useRequest } from "ahooks";
 
import Bindcom from './bind'
export default function Index() {
  const [form] = Form.useForm();
  const addRef= useRef()
  const tbRef= useRef()
  const downParams = useRef()
  const bindRef = useRef()
 // const [params, setexparams] = useState({})
  // const [areaName, setAreaName] = useState()
  const varlabel = useSelector(levelDefaultLabel)
  const projectId = useSelector(selectProjectId)
  const [total, setTotal] = useState(0)
  const [schemeId, setSchemeId] = useState(null)
  const [alike, setAlike] = useState("")
  const [explains, setExplains] = useState([])
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions.map(p=>p.value) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }
  const ckOnChange = (list) => {
    console.log(list)
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };
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
      if (!(Number.isInteger(projectId) && Number.isInteger(schemeId))) {
        return {
          list: [],
          total: 0
        }
      }
      let { data, success, total } = await useDetail({}, { projectId, schemeId, pageNum: current, pageSize })
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
    refreshDeps: [projectId, schemeId]
  })
  const onExport =useCallback(() => {  
    downParams.current.pageNum=1;
    downParams.current.pageSize=total
    return   getDetail({}, downParams.current).then(res => {
      let {success, data, total} =res
      if(success && Array.isArray(data)) { 
        return {
          list: data,
          total,
        }
      }else {
        if(!success) message.warning(errMsg || "接口出错" )
        return {
          list: [],
          total:0
        }
      }

    })
 }, [total])
  const getData = async () => {
    try {
      let { success, data, errMsg } = await useList({
        projectId,
        alike,
      });
      if (success && Array.isArray(data) && data.length) {
        //  setOptions(data)
        setSchemeId(data[0]?.id)
        return data
      } else {
        // setOptions([])
        setSchemeId(null)
        if (!success) {
          return Promise.reject(errMsg)
        } else {
          return []
        }

      }
    } catch (error) {
      return Promise.reject(error)
    }
  };
  const { data: options } = useRequest(getData, {
    refreshDeps: [projectId, alike]
  })

  const onChange = (v) => {
    setSchemeId(v.target.value)
  }
  const onSearch = (v) => {
    setAlike(v)
  }
  const onCancel=()=>{
    setIndeterminate(false)
    setCheckAll(false)
    setCheckedList([])
    addRef.current.onCancel()
  }
  const onAdd=()=>{
    addRef.current.onOpen()
  }
 const onOk =()=>{ 
  onCancel()
 
 }
 const showlineconfig =(  ) => {
  
 bindRef.current.onOpen()
}
 const Ctitle = (<TitleBox>
  <span>能效设备类型</span>
  <Typography.Link onClick={onAdd}><PlusCircleOutlined style={{marginRight: "8px"}} />添加</Typography.Link>
 </TitleBox>)
 const Dtitle = (<TitleBox>
  <span>设备列表(空压机)</span>
   <Space size={16}>
     <CustButtonT text="new" onClick={()=> showlineconfig()}></CustButtonT>
     <ExportExcel tb={tbRef}></ExportExcel>
   </Space>
 </TitleBox>)
  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <Titlelayout layout="flex" title={Ctitle} dr="column"  >
          <Input.Search placeholder="请输入关键字查询" allowClear onSearch={onSearch} />
          <Radio.Group value={schemeId} onChange={onChange} style={{ marginTop: "16px" }}>
            <List 
            dataSource={mockopt}
            split={false}
            size="small"
            renderItem={(item) => (
              <List.Item>
                {item}
              </List.Item>
            )}
            ></List>
            <Space direction="vertical">
              {
               
              }
             {/*  {
                options?.map?.(o => <Radio value={o.id}>{o.name}</Radio>)
              } */}
            </Space>
          </Radio.Group>
        </Titlelayout>
         
        <div className="right">
          <Cform form={form} layout="inline">
            <Space size={16}>
               <Form.Item label={varlabel} name="areaId">
                <AreaSelect  isall={false} />
               </Form.Item>
               <Form.Item label="设备查询">
                 <Input style={{width: "200px"}}></Input> 
               </Form.Item>
            </Space>
          </Cform>
          <Titlelayout layout="flex" title={Dtitle} dr="column"> 
              <div className="outtbwrap">
                <div className="inerwrap">
                <UserTable columns={cols} {...tableProps} ref={tbRef} onExport={onExport} ></UserTable>   
                </div>
              </div>
          </Titlelayout>
        </div>
           <CModal title="设备类型选择"   onOk={onOk}   width={394} mold="cust"    ref={addRef} onCancel={onCancel} >
               <Groupwrap>
                  <Space direction="vertical">
                     <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>全部</Checkbox>
                     <Checkbox.Group options={plainOptions} value={checkedList} onChange={ckOnChange} />
                  </Space>
                  </Groupwrap>
           </CModal>
           <Bindcom ref={bindRef}></Bindcom>
      </Mainwrap>
    </Pagecount>
  );
}
