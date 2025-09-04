import { Form,  Select, Input} from 'antd'
import { Frombox } from "./style";
import {AreaSelect} from "@com/useSerach/comhead"
const lightType = ["","道路灯", "高杆路灯", "太阳能路灯", "景观灯","其他"];
export const cols = [
  {
    title: "园区名称",
    dataIndex: "areaName",
    key: "areaName",
  },
  {
    title: "路灯名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "路灯型号",
    dataIndex: "model",
    key: "model",
  },
  {
    title: "路灯编号",
    dataIndex: "no",
    key: "no",
  },
  {
    title: "所属计量设备",
    dataIndex: "mSn",
    key: "mSn",
  },
  {
    title: "所属控制器编号",
    dataIndex: "cSn",
    key: "cSn",
  },
  {
    title: "安装地址",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "路灯类型",
    dataIndex: "type",
    key: "type",
    render: (type) => lightType[type],
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
const options = [
  { label: "道路灯", value: 1 },
  { label: "高杆路灯", value: 2 },
  { label: "太阳能路灯", value: 3 },
  { label: "景观灯", value: 4 },
  { label: "其他", value: 5 },
];
export const items =(option, csn, msn)=> (
  <Frombox>
    <div>
      <Form.Item label="所属园区" rules={rules} name="areaId">
        <AreaSelect style={w224} />
      </Form.Item>
      <Form.Item label="安装地址" rules={rules} name="address">
        <Input style={w224} />
      </Form.Item>
      <Form.Item label="备注" name="remark">
        <Input.TextArea rows={2} style={w224} />
      </Form.Item>
    </div>
    <div>
      <Form.Item label="路灯名称" rules={rules} name="name">
        <Input style={w224} />
      </Form.Item>
      <Form.Item label="路灯型号" rules={rules} name="model" >
        <Select options={option} fieldNames={{label: "model", value:"model"}}></Select>
      </Form.Item>
      <Form.Item label="路灯编号" rules={rules} name="no">
        <Input></Input>
      </Form.Item>
      <Form.Item label="所属计量设备" name="mSn" labelCol={{flex: "8em"}}>
        <Select options={msn} placeholder="请输入电表sn"  fieldNames={{label: "name", value:"text"}}></Select>
      </Form.Item>
      <Form.Item label="所属控制器编号" name="cSn" labelCol={{flex: "8em"}}  rules={rules}>
        <Select options={csn} placeholder="请输入路灯控制器" fieldNames={{label: "name", value:"text"}}></Select>
      </Form.Item>
      <Form.Item label="路灯类型" name="type">
        <Select options={options}></Select>
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
