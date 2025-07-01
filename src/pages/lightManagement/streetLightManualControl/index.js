import React, { useRef, useState, useEffect } from "react";
import { Space, Form, Select, Input } from "antd";
import Pagecount from "@com/pagecontent";
import {useSelector} from "react-redux"
 import {selectProjectId} from "@redux/systemconfig"
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
 
import { CustButtonT, ExportExcel, ChartList } from "@com/useButton";
import UseTree from "@com/useTree"
import { options } from "./data";
import CModal from "@com/useModal";
 import { useList } from "./api.js";
 
import { Mainwrap, TitleBox } from "./style";

export default function Index() {
   const [treeId, setTreeId] = useState([])
 
  const [form] = Form.useForm();
 
  const  projectId  =  useSelector(selectProjectId)
  const getData = async () => {
    const {alike="", type} = form.getFieldsValue()
    try {
      let { success,data } = await useList({},{
        areaId:treeId,
        projectId,
        alike,
        type 
      });

    } catch (error) {
       console.log(error)
    }
  };

 useEffect(()=> {
   if(Number.isInteger(projectId)&& Array.isArray(treeId)) {
    getData()
   }
 },[projectId, treeId])
 
  const title = (
    <TitleBox>
      <span>路灯列表</span>
      <Space>
        <CustButtonT text="control"></CustButtonT>
      </Space>
    </TitleBox>
  );
  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <div className="left">
            <span className="title">路灯设备列表</span>
           <UseTree areaId={0} setTreeId={setTreeId} setLine={()=>{}} showline={false} datatype={NaN} energytype={1} ></UseTree>
        </div>
        <div className="right">
          <div className="up">
            <Form form={form} layout="inline">
              <Space>
              <Form.Item name="alike" label="路灯名称/编号">
                <Input placeholder="请输入路灯名称或编号"></Input>
              </Form.Item>
              <Form.Item name="type" label="路灯类型" initialValue={0}>
                <Select options={options} style={{width: "200px"}}></Select>
              </Form.Item>
              <Form.Item>
                <CustButtonT text="search" onClick={getData}></CustButtonT>
              </Form.Item>
              </Space>
            </Form>
          </div>
          <Titlelayout layout="flex" title={title}></Titlelayout>
        </div>
      </Mainwrap>
    </Pagecount>
  );
}
