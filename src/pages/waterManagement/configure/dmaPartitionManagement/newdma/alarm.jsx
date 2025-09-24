import React from 'react'
import {Form, Select, Row, Col, Input,InputNumber, Cascader, Radio, Space, Switch, message,Button} from "antd" 
import {useRequest} from "ahooks"
import {useLocation} from "react-router-dom"
import {useUpdateAlarmSetting,useGetAlarmSettings} from "../api"
import { alarmoption, custvalidfn, rules} from "../data"
import { CustButton } from '@com/useButton'
import {isObject} from "@com/usehandler"
import Titlelayout from "@com/titlelayout";
import {TitleBox} from "../style"
export default function Index({projectId,id}) {
 const [form] = Form.useForm()
 
 console.log("id",id)
 const getData = async()=> {
    try {
      let fag = [projectId,id].some(d => Number.isInteger(parseInt(d)))
      if(!fag) return
      let {success, data, errMsg} = await useGetAlarmSettings({projectId, id})
      if(success && Array.isArray(data) && data.length)  {
        let values = data.reduce((pre,cur, index)=>{ 
          pre[index]= {...cur,alarmSettingJson:JSON.parse(cur.alarmSettingJson)}
         
          return pre
        },{})
        form.setFieldsValue(values)
        return Array.isArray(data) ? data : []
      }else{
        return Promise.reject(errMsg)
      }
    } catch (error) {
      return Promise.reject(error)
    }

 }
 

 const {data, refresh} =  useRequest(getData, {
  refreshDeps: [projectId,id]
})

const onRest = ()=> {}
const onSubmit= async()=> {
  try {
    let values =  await form.validateFields()
     console.log("values",values)
     values.length =4
    let params = Array.from(values)?.map?.(v => ({...v, alarmSettingJson: JSON.stringify(v.alarmSettingJson)}))
    let body ={
      projectId,
      id,
      alarmSettings: params
    }
   let {success, errMsg} =  await useUpdateAlarmSetting({},body)
   if(success) {
    message.success("设置成功")
    refresh()
   }else {
     message.warning(errMsg)
   }
  } catch (error) {
    console.log(error)
  }
}

 

  const Ctitle =(<TitleBox ><span>分区报警设置</span><Space> <CustButton onClick={onRest} type="default">重置</CustButton>
           <CustButton onClick={onSubmit}>提交</CustButton></Space></TitleBox>)
  return (
    <Titlelayout title={Ctitle} layout="flex" pv="16px">
      <Form form={form} className='alarm' labelCol={{flex:"5em"}} colon={false}>
        <div className="item bg">
          <span>分区持续多天未生成漏损</span>
          <Space align='center' size={16}>
            <Form.Item name={["0", "alarmType"]} initialValue={1}>
<Input hidden></Input>
            </Form.Item>
            <Form.Item label="报警级别" name={["0", "level"]} initialValue="1">
              <Select options={alarmoption} style={{width: "160px"}}></Select>
            </Form.Item>
            <Form.Item name={["0", "isEnabled"]} valuePropName='checked' initialValue={false}>
<Switch checkedChildren="开" unCheckedChildren="关" style={{width: "46px"}}></Switch>
            </Form.Item>
          </Space>          
        </div>
        <div className="item">
         <Space size={16}><Form.Item label="持续天数" name={["0", "alarmSettingJson", "continuousHours"]} >
            <InputNumber addonAfter="天" min={1}></InputNumber>
          </Form.Item>
          <span className='tip'>漏损大于设置的天数未生成产生报警；阈值不能为负数；</span>
          </Space>
        </div>
{/* 2 */}
        <div className="item bg">
          <span>分区漏损率连续超限</span>
          <Space align='center' size={16}>
          <Form.Item name={["1", "alarmType"]} initialValue={2}>
          <Input hidden></Input>
          </Form.Item>
            <Form.Item label="报警级别" name={["1", "level"]} initialValue="1">
              <Select options={alarmoption} style={{width: "160px"}}></Select>
            </Form.Item>
            <Form.Item name={["1", "isEnabled"]} valuePropName='checked' initialValue={false}>
<Switch checkedChildren="开" unCheckedChildren="关" style={{width: "46px"}}></Switch>
            </Form.Item>
          </Space>          
        </div>
        <div className="item column">
         <Space size={16}><Form.Item label="持续天数" name={["1", "alarmSettingJson", "continuousHours"]}   >
            <InputNumber addonAfter="天" min={1}></InputNumber>
          </Form.Item>
          <span className='tip'>漏损率不在设置区间产生报警；</span>
          </Space>
          <Space size={16}>
             <Form.Item label="阈值范围" name={["1", "alarmSettingJson", "reasonableRange","min"]}  >
              <InputNumber min={0} max={100} precision={2} addonAfter="%"></InputNumber>
             </Form.Item>
             <Form.Item label="-" name={["1", "alarmSettingJson", "reasonableRange","max"]} rules={[
              custvalidfn(["1", "alarmSettingJson", "reasonableRange","min"])
             ]}>
              <InputNumber min={0} max={100} addonAfter="%" precision={2}></InputNumber>
             </Form.Item>
             <span className='tip'>阈值范围0-100；</span>
          </Space>
        </div>
        {/* 3 */}
        <div className="item bg">
          <span>分区漏损量连续超限</span>
          <Space align='center' size={16}>
          <Form.Item name={["2", "alarmType"]} initialValue={3}>
          <Input hidden></Input>
          </Form.Item>
            <Form.Item label="报警级别" name={["2", "level"]} initialValue="1" >
              <Select options={alarmoption} style={{width: "160px"}}></Select>
            </Form.Item>
            <Form.Item name={["2", "isEnabled"]} valuePropName='checked' initialValue={false}>
<Switch checkedChildren="开" unCheckedChildren="关" style={{width: "46px"}}></Switch>
            </Form.Item>
          </Space>          
        </div>

        <div className="item column">
         <Space size={16}><Form.Item label="持续天数" name={["2", "alarmSettingJson", "continuousHours"]}   >
            <InputNumber addonAfter="天" min={1}></InputNumber>
          </Form.Item>
          <span className='tip'>漏损量不在设置区间产生报警；</span>
          </Space>
          <Space size={16}>
             <Form.Item label="阈值范围" name={["2", "alarmSettingJson", "reasonableRange","min"]}  >
              <InputNumber min={0} addonAfter="吨" precision={2}></InputNumber>
             </Form.Item>
             <Form.Item label="-" name={["2", "alarmSettingJson", "reasonableRange","max"]} rules={[
              custvalidfn(["2", "alarmSettingJson", "reasonableRange","min"])
             ]}>
              <InputNumber min={0} addonAfter="吨" precision={2}></InputNumber>
             </Form.Item>
             <span className='tip'>阈值不能为负数；</span>
          </Space>
        </div>
  {/* 4 */}
        
      <div className="item bg">
          <span>分区漏损量连续超限</span>
          <Space align='center' size={16}>
          <Form.Item name={["3", "alarmType"]} initialValue={4}>
          <Input hidden></Input>
          </Form.Item>
            <Form.Item label="报警级别" name={["3", "level"]} initialValue="1">
              <Select options={alarmoption} style={{width: "160px"}}></Select>
            </Form.Item>
            <Form.Item name={["3", "isEnabled"]} valuePropName='checked' initialValue={false}>
<Switch checkedChildren="开" unCheckedChildren="关" style={{width: "46px"}}></Switch>
            </Form.Item>
          </Space>          
        </div>

        <div className="item column">
         <Space size={16}><Form.Item label="持续天数" name={["3", "alarmSettingJson", "continuousHours"]}  >
            <InputNumber addonAfter="天" min={1}></InputNumber>
          </Form.Item>
          <span className='tip'>日供水量未在区间阈值内产生报警；</span>
          </Space>
          <Space size={16}>
             <Form.Item label="阈值范围" name={["3", "alarmSettingJson", "reasonableRange","min"]}   >
              <InputNumber min={0} addonAfter="吨" precision={2}></InputNumber>
             </Form.Item>
             <Form.Item label="-" name={["3", "alarmSettingJson", "reasonableRange","max"]} rules={[
              
              custvalidfn(["3", "alarmSettingJson", "reasonableRange","min"])
             ]} >
              <InputNumber min={0} addonAfter="吨" precision={2}></InputNumber>
             </Form.Item>
             <span className='tip'>阈值不能为负数；</span>
          </Space>
        </div>
      </Form>
      </Titlelayout>
  )
}
