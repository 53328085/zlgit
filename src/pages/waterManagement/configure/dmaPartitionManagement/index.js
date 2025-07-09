import React, { useRef, useState, useEffect, useMemo } from "react";
import { Space, Form, Select, Input,Radio ,Typography} from "antd";
import Pagecount from "@com/pagecontent";
import {useNavigate, useLocation} from "react-router-dom"
import {useSelector} from "react-redux"
 import {selectProjectId} from "@redux/systemconfig"
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import UseTree from "@com/useTree";
import {RadiogroupB} from "@com/comstyled"
import { cols, options,loptions } from "./data";
 import {CustButton} from "@com/useButton"
 import {  useGetListPaged } from "./api.js";
 
import { Mainwrap, TitleBox } from "./style";

import { useAntdTable, useRequest} from "ahooks";
import Newdma from "./newdma"
 const {Link} = Typography
 
export default function Index() { 
    const navigate = useNavigate();
    const { pathname, state,hash } = useLocation();
  console.log(useLocation())
  const [form] = Form.useForm()
  const  projectId  =  useSelector(selectProjectId)  
  const [treeId, setTreeId] = useState(null)
  const [level, setLevle] = useState("0")
  const  listnew = useMemo(()=> {
    return !hash || hash=="#list"
  }, [hash])
  const getDetail =async ({current, pageSize}, formData)=> {
     try {
       if(!(Number.isInteger(projectId) && Array.isArray(treeId))) {
        return  {
        list:[],
        total:0
       }
      }
       let {name="", partitionType} = formData
       let body = {
        pageNum:current,
        pageSize,
        projectId,
        parentId: treeId?.[0],
        name,
        partitionType,
        level,
        sorting: ""
       }
       let {data,success, total} = await useGetListPaged(body,{})
       if(success && Array.isArray(data) ) {         
          return {
             list:  data,
             total
          }
       }else {
        return {
          list: [],
          total
       }
        
       }
     } catch (error) {
       console.log(error)
     }
  }
  
const {tableProps} =  useAntdTable(getDetail, {
    form,
    defaultPageSize: 14,
    refreshDeps: [projectId, treeId, level]
  })

const dmachange =(v) => {
  setLevle(v.target.value)
}
const addDma =(type) => {
  navigate(pathname + "#" + type, { state: state, replace: true });
}
 
const Ctitle = <TitleBox>
  <Space size={16}>
    <span>分区列表</span>
    <RadiogroupB options={loptions}  value={level}
        onChange={dmachange}
        optionType="button"
        buttonStyle="solid"></RadiogroupB>
  </Space>
  <CustButton onClick={()=>addDma("new")}>新建分区</CustButton>
</TitleBox>
 
 const columns = [...cols,  {
  title: "操作",
  dataIndex: "operation",
  key: "operation",
  render: ()=><Space></Space>
},]
 const sortChnage=()=> {

 }
  return (
    <Pagecount pd="0" bgcolor="none">
    {listnew ?  <Mainwrap>
        <div className="left">
            <span className="title">选择区域</span> 
            <UseTree
            areaId={0}
            setTreeId={setTreeId}
            setLine={() => {}}
            showline={false}
            datatype={3}
            energytype={1}
            multiple={false}
            allselect={false}
          />
        </div>
        <div className="right">
           <div className="search">
              <Form form={form} layout="inline">
                <Space size={16}>
                  <Form.Item label="分区名称" name="name">
                    <Input ></Input>
                  </Form.Item>
                  <Form.Item label="分区类型" name="partitionType" initialValue={1}>
                    <Select options={options} style={{width: "200px"}}></Select>
                  </Form.Item>
                  </Space>
              </Form>
           </div>
          <Titlelayout layout="flex" title={Ctitle}  dr="column"> 
              <UserTable columns={cols} {...tableProps} onChange={sortChnage}></UserTable> 
          </Titlelayout>
        </div>
      </Mainwrap>
     : <Newdma projectId={projectId} addDma={addDma} />
    }
      
    </Pagecount>
  );
}