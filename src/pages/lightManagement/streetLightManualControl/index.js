import React, { useRef, useState, useEffect } from "react";
import { Space, Form, Select, Input,Checkbox,Typography } from "antd";
import Pagecount from "@com/pagecontent";
import {useSelector} from "react-redux"
 import {selectProjectId} from "@redux/systemconfig"
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
 
import { CustButtonT, ExportExcel, ChartList } from "@com/useButton";
import UseTree from "@com/useTree"
import { options,states } from "./data";
import CModal from "@com/useModal";
 import { useList } from "./api.js";
 import opensvg from './svgs/open.svg'
 import closesvg from './svgs/close.svg'
import { Mainwrap, TitleBox } from "./style";
const {Text} = Typography
export default function Index() {
   const [treeId, setTreeId] = useState([])
   const [lingts, setLights] = useState([])
  const [form] = Form.useForm();
 
  const  projectId  =  useSelector(selectProjectId)
  const getData = async () => {
    const {alike="", type} = form.getFieldsValue()
    try {
      let { success,data } = await useList({},{areaIds:treeId,
        projectId,
        alike:"",
       // type 
      });
      if(success && Array.isArray(data)) {
        setLights(data)
      }else {
        setLights([])
      }
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
              <Space size={32}>
              <Form.Item name="alike" label="路灯名称/编号">
                <Input placeholder="请输入路灯名称或编号"></Input>
              </Form.Item>
              <Form.Item name="type" label="路灯类型" initialValue={0}>
                <Select options={options} style={{width: "200px"}}></Select>
              </Form.Item>
              <Form.Item name="state" label="开关状态" initialValue={0}>
                <Select options={states} style={{width: "200px"}}></Select>
              </Form.Item>
              <Form.Item>
                <CustButtonT text="search" onClick={getData}></CustButtonT>
              </Form.Item>
              </Space>
            </Form>
          </div>
          <Titlelayout layout="flex" title={title}>
            <div className="content">
              <div className="tip">
               <Space><Checkbox>全选</Checkbox><Text>已选择台</Text></Space>
               <Text>开启/关闭: 20/4</Text>
              </div>
              <Checkbox.Group>
              <div className="lights">
                   {
                    lingts.map(l => (<div className="light">
                      <Checkbox value={l.sn}>{l.name}</Checkbox>
                      <div>（{l.sn}）</div>
                      <img src={l.state==1 ? opensvg : closesvg} className="img"></img>
                    </div>))
                   }
              </div>
              </Checkbox.Group>
            </div>

          </Titlelayout>
        </div>
      </Mainwrap>
    </Pagecount>
  );
}
