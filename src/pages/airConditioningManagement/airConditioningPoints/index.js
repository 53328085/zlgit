import React, { useEffect, useMemo, useRef, useState } from "react";

import _ from "lodash";
import { useSelector } from "react-redux";
import {nanoid} from "@reduxjs/toolkit"
import { selectProjectId } from "@redux/systemconfig.js";
import CModal from '@com/useModal'
import {
  message,
  Form,
  Badge,
  Slider, 
  Space,
  Select,
 Radio,  
} from "antd";

import { Cspin, AirPoint } from "@com/comstyled";
import { isObject } from "@com/usehandler";
import Pagecount from "@com/pagecontent";
import { Main,Content } from "./style";
import { useAreas, usePoints,useList,useSetControl } from "./api";
import {initialValues,marks,optobj} from "./data"
import  {Wet, Hot, Cold, Wind} from "./icon"
export default function Index() {
  const [form] = Form.useForm();
  const ref=useRef()
  const projectId = useSelector(selectProjectId);
  const [airConditioner, setAirConditioner] = useState({});
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [areas, setAreas] = useState([]);
  const [ariId, setAriId] = useState(null)
  const [treeId, setTreeID] = useState(null);
  const [title, setTittle] = useState("");
// 0,1 离线，2：在线
const getList =async(id)=>{
try {
    const body ={
       projectId,
        "alike": "",
        "type": 0,
        "ioState": 0,
        "ids": [
             id
        ]
    }
  let {success, data} =  await useList({},body)
  const {details } =data || {};
  if(success && Array.isArray(details) && isObject(details?.[0]) && Array.isArray(details?.[0]?.fields) && details?.[0]?.fields?.length) {
     
     let values ={}
     details?.[0]?.fields?.forEach((f,i)=>{
        const{index,name, dValue} = f
        if(name=="开关" &&  dValue) {
          values.ioState = dValue
        }else if(name=="模式" &&  dValue){
            values.workMode = dValue
        }else if(name=="风速" &&  dValue) {
            values.windSpeed = dValue
        }
     })
     values.temperature = details?.[0]?.temperature
     form.setFieldsValue(values) 
     ref.current.onOpen()
  }else{
    message.error("设备离线，获取数据失败")
  }

} catch (error) {
    
}
}


  const onSet=(ari)=> {
     const {conditionerId,airConditionerName} = ari
    setAriId(conditionerId)
    setTittle(airConditionerName)
    getList(conditionerId)
  }
 
  const aris = useMemo(()=> {
    return airConditioner?.locations?.map(l => <AirPoint left={l.x} onClick={()=>onSet(l)}  className={ariId==l.conditionerId ? "action" : ""} top={l.y} key={nanoid()} ioState={l.ioState}>{l.desc}</AirPoint>)
  }, [airConditioner,ariId])
  
  const getPoistion = async () => { // 获取点位
    try {
        setSpinning(true);
      let {success, data} = await usePoints({ projectId, desc: treeId });
      if(success && isObject(data)){
        setAirConditioner(data); 
      } 
      setSpinning(false);
    } catch (error) {
        setSpinning(false);
    }
  };

  const getTabs = async () => { //  获取区域
    try {
      let { success, data } = await useAreas({ projectId });
      if (success && isObject(data) && Object.keys(data)?.length) {
        const value = Object.keys(data)[0];
        let Tabs = [];
        for (const [key, value] of Object.entries(data)) {
          Tabs.push({ label: value, value: key?.toString() });
        }

        setAreas(Tabs);

        setTreeID(value);
      } else {
        if (Object.keys(data)?.length == 0) {
          message.warning("请配置空调点位图");
        }
      }
    } catch (error) {}
  };

  const Onchage = (e) => {
    console.log(e);
    setTreeID(e)
  };

  useEffect(() => {
    if (!projectId) return;
    getTabs();
  }, [projectId]);
  useEffect(() => {
    if (treeId) {
      getPoistion();
    }
  }, [treeId]);
  const Ctitle=<span style={{fontSize: "16px",color:"#303133"}}>{title}控制列表</span>
  const onOk=async()=>{
    try {
      let values =   await form.validateFields()
      let body ={
        projectId,
        conditionerIds:[ariId],
        ...values
      }
     let {success, errMsg} = await useSetControl({},body)
     if (success){
        message.success('设置成功')
        ref.current.onCancel()
        getPoistion()
     }else{
      message.error(errMsg || "设置失败")
    }
    } catch (error) {
        
    }

  }
 
  return (
    <Cspin spinning={spinning} tip="图片下载中……">
      <Pagecount pd="0" bgcolor="none" style={{ margin: "-16px" }}>
        <Main>
        <img src={airConditioner.image} className="img" />
         {aris} 
          <div className="title" key="title">
            <Space size={16}>
              <span className="text">空调区域</span>
              <Select
                style={{ width: 200 }}
                value={treeId}
                onChange={Onchage}
                options={areas}
              />
              <span className="text">空调点位状态：</span>
              <Badge status="success" text="开启" key="success" />
              <Badge status="default" text="关闭" key="default" />
            </Space>
          </div>
         
        </Main>
         <CModal title={Ctitle}   onOk={onOk}   width={500} mold="cust"  closable   ref={ref}>
            <Content>
                <Form form={form} labelAlign="left" labelCol={{flex: "4em"}} preserve={false} initialValues={initialValues}>
                 <Form.Item label="开关" name="ioState">
                    <Radio.Group  optionType="button" buttonStyle="solid">
                        <Radio value={1}>开</Radio>
                        <Radio value={2}>关</Radio>
                    </Radio.Group>
                 </Form.Item>
                 <Form.Item label="温度" name="temperature">
                    <Slider min={16} max={31} marks={marks}></Slider>
                 </Form.Item>
                 <Form.Item label="模式" name="workMode">
                    <Radio.Group optionType="button" buttonStyle="solid" size="large">
                        <Radio value={4}><div className="iconwrap"><Hot /><span className="txt">制热</span></div></Radio>
                        <Radio value={1}><div className="iconwrap"><Cold /><span className="txt">制冷</span></div></Radio>
                        <Radio value={3}><div className="iconwrap"><Wind /><span className="txt">送风</span></div></Radio>
                        <Radio value={2}><div className="iconwrap"><Wet /><span className="txt">除湿</span></div></Radio>
                    </Radio.Group>
                 </Form.Item>
                 <Form.Item label="风速" name="windSpeed">
                    <Radio.Group optionType="button" buttonStyle="solid" size="medium">
                        <Radio value={5}>自动</Radio>
                        <Radio value={3}>低</Radio>
                        <Radio value={2}>中</Radio>
                        <Radio value={1}>高</Radio>
                    </Radio.Group>
                 </Form.Item>
                </Form>
                </Content>
        </CModal>
      </Pagecount>
    </Cspin>
  );
}
