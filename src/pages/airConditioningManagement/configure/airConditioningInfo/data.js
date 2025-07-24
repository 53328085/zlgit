import { Form,  Select, Input, Typography, InputNumber} from 'antd'
const {Text} = Typography
import { Frombox } from "./style";
import {AreaSelect} from "@com/useSerach/comhead"
 
export const airconditioner = [
  { label: "全部空调类型", value: 0 },
  { label: "分体式空调", value: 1 },
  { label: "多联机空调", value: 2 },
  { label: "中央空调面板", value: 3 },
];
export const useTypeopt =[
  { label: "全部用能类型", value: 0 },
  { label: "客户用能", value: 1 },
  { label: "公共用能", value: 2 },
]
export const cols = [
  {
    title: "园区名称",
    dataIndex: "areaName",
    key: "areaName",
  },
  {
    title: "安装地址",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "空调名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "空调型号",
    dataIndex: "model",
    key: "model",
  },
  {
    title: "空调控制器",
    dataIndex: "cSn",
    key: "cSn",
  },
  {
    title: "计量设备",
    dataIndex: "mSn",
    key: "mSn",
  },
  {
    title: "所属网关",
    dataIndex: "gateWay",
    key: "gateWay",
  },
  {
    title: "空调类型",
    dataIndex: "type",
    key: "type",
    render: (type) => airconditioner.find(a => a.value==type)?.label,
  },
  {
    title: "用能类型",
    dataIndex: "useType",
    key: "useType",
    render: (type) => useTypeopt.find(a => a.value==type)?.label,
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
  },
];
const rules = [
  {
    required: true,
  },
];
const w224 = { width: "224px" }; //0：道路灯 1：高杆路灯 2：太阳能路灯 3：景观灯
 



 
// 空调控制器跟所属网关 关联， 计量设备跟用能类型 关联

export const items =({csn=[], msn=[],model=[]})=> (
  <Frombox>
    <div>
      <Form.Item label="所属园区" rules={rules} name="areaId">
        <AreaSelect style={w224}  />
      </Form.Item>
      <Form.Item label="安装地址" rules={rules} name="address">
        <Input style={w224} />
      </Form.Item>
      <Form.Item label="备注" name="remark">
        <Input.TextArea rows={2} style={w224} />
      </Form.Item>
    </div>
    <div>
      <Form.Item label="空调名称" rules={rules} name="name">
        <Input style={w224} />
      </Form.Item>
      <Form.Item label="空调编号" rules={rules} name="sn" >
        <Input></Input>
      </Form.Item>
      <Form.Item label="空调型号" rules={rules} name="modelId">
        <Select options={model} fieldNames={{label: "model", value: "id"}}></Select>
      </Form.Item>
      <Form.Item label="空调类型" rules={rules} name="type">
        <Select options={airconditioner.slice(1)} placeholder="请选择"></Select>
      </Form.Item>  
      <Form.Item label="空调控制器" name="csn">
        <Select options={csn} fieldNames={{label: "name", value: "sn"}} ></Select>
      </Form.Item>
      <Form.Item label="所属网关" shouldUpdate={(cur, pre)=> cur.csn!=pre.csn}>
        {
          ({getFieldValue})=> {
            let sn = getFieldValue("csn")
            let gatewaySn = csn?.find?.(c=> c.sn ==sn)?.gatewaySn
            return <Text strong>{gatewaySn}</Text>
          }
        }
      </Form.Item>    
      <Form.Item label="计量设备" name="msn">
        <Select options={msn} fieldNames={{label: "name", value: "sn"}}></Select>
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(cur, pre)=>cur.msn!=pre.msn}>
        {
          ({getFieldValue,setFieldValue, resetFields})=> {
               let  sn=getFieldValue("msn")
               let useType = msn?.find?.(m=>m.sn==sn)?.customerType
               if(Number.isInteger(useType)) {
                setFieldValue("useType", useType)
               }else{
                resetFields(["useType"])
               }
              
               return null
          }
        }
      </Form.Item>
      <Form.Item label="用能类型" rules={rules} name="useType">
        <Select options={useTypeopt.slice(1)} placeholder="请选择"></Select>
      </Form.Item>
      <Form.Item name="id" noStyle initialValue={0}>
        <Input hidden></Input>
      </Form.Item>
      <Form.Item name="projectId" noStyle>
        <Input hidden></Input>
      </Form.Item>
    </div>
  </Frombox>
);

export const initems =({model=[]})=> (
  
  <Frombox style={{columnGap: "64px"}}>
    <div>
      <Form.Item label="所属园区" rules={rules} name="areaId">
        <AreaSelect style={{width: "100%"}} disabled  />
      </Form.Item>
      <Form.Item label="安装地址" rules={rules} name="address">
        <Input  />
      </Form.Item>
      <Form.Item label="备注" name="remark">
        <Input.TextArea rows={2}  />
      </Form.Item>
    </div>
    <div>
      <Form.Item label="设备名称" rules={rules} name="name">
        <Input  />
      </Form.Item>
      <Form.Item label="设备编号" rules={rules} name="sn" >
        <Input></Input>
      </Form.Item>
      <Form.Item label="设备型号" rules={rules} name="modelId">
        <Select options={model} fieldNames={{label: "model", value: "id"}}></Select>
      </Form.Item>
      <Form.Item label="空调类型" rules={rules} name="type">
        <Select options={airconditioner.slice(1)} placeholder="请选择"></Select>
      </Form.Item>
      <Form.Item label="所属网关" name="gateWay"  >
        <Input disabled></Input>
      </Form.Item>    
      <Form.Item label="用能分摊" name="shareRatio">
        <InputNumber addonAfter="%" />
      </Form.Item> 
      <Form.Item label="用能类型" rules={rules} name="useType">
        <Select options={useTypeopt.slice(1)} placeholder="请选择" disabled></Select>
      </Form.Item>
      <Form.Item name="id" noStyle initialValue={null}>
        <Input hidden></Input>
      </Form.Item>
      <Form.Item name="projectId" noStyle>
        <Input hidden></Input>
      </Form.Item>
      <Form.Item name="shareRatio" noStyle>
        <Input hidden></Input>
      </Form.Item>
    </div>
  </Frombox>
  
);