import {
  Form,
  Select,
  Input,
  Slider,
  Radio,
  InputNumber,
  TimePicker,
  Typography,
  Tag,
  Space,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {  Scene, CTag,  } from "./style";
import imgsrc from "@svgs/index";
import { CustButton } from "@com/useButton";
import {Cslider} from "@com/Custantd"
const { Link } = Typography;


 
export const cols = [
  //
  {
    title: "方案名称",
    dataIndex: "strategyName",
    key: "strategyName",
  },
  {
    title: "场景",
    dataIndex: "sceneDesc",
    key: "sceneDesc",
  },
  {
    title: "绑定路灯数",
    dataIndex: "bindNum",
    key: "bindNum",
  },
  {
    title: "创建人",
    dataIndex: "creater",
    key: "creater",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
  },
];

export const bindcol =[
  {
    title: "路灯名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "控制器编号",
    dataIndex: "cSn",
    key: "cSn",
  },
  {
    title: "所属区域",
    dataIndex: "areaName",
    key: "areaName",
  }, 
]
export const rules = [
  {
    required: true,
  },
];
const w255 = { width: "255px" }; //0：道路灯 1：高杆路灯 2：太阳能路灯 3：景观灯
const options = [
  { label: "全夜灯", value: "全夜灯" },
  { label: "半夜灯", value: "半夜灯" },
  { label: "景观灯", value: "景观灯" },
  { label: "泛光灯", value: "泛光灯" },
];
const timeType = [
  { label: "日出前", value: "日出前" },
  { label: "日出后", value: "日出后" },
  { label: "日落前", value: "日落前" },
  { label: "日落后", value: "日落后" },
];
const marks = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  60: '60',
  70: '70',
  80: '80',
  90: '90',
  100: '100',
};
export const items = (
  <>
    <Form.Item label="方案名称" name="schemeName" rules={rules} labelAlign="left">
      <Input placeholder="请输入" style={w255}></Input>
    </Form.Item>
    <Form.List name="scenes" initialValue={[{}]}>
      {(fileds, { add, remove }) => (
        <Scene>
          {fileds.map((field, _, arr) => (
            <div>
              <Form.Item
              labelAlign="left"
              style={{marginBottom: "4px"}}
                          label={`场景${new Intl.NumberFormat(
                            "zh-Hans-CN-u-nu-hanidec"
                          ).format(field.name + 1)}`}
                          rules={rules}
                          name={[field.name, "sName"]}
                        ><Select
                            options={options}
                            style={{ width: "200px" }}
                          ></Select>
                        </Form.Item >
            <Form.List name={[field.name, "tasks"]} initialValue={[{}]}>
              {(inerfileds, inmethods) => {                
                return (
                  <div className="scene" key={field.key}>
                    <div className="hander">
                      <div className="list">                      
                        <div className="tags">
                          {inerfileds?.map((i, idx, arr) => {
                            
                            return (
                              <CTag
                                key={i.key}
                                closable={arr.length !== 1}
                                onClose={() => inmethods.remove(i.name)}
                              >
                                <Form.Item noStyle  shouldUpdate={(cur, pre) => {                            
                              return (
                                cur["scenes"]?.[field.name]?.["tasks"]?.[i.name] != pre["scenes"]?.[field.name]?.["tasks"]?.[i.name]
                              );
                            }}>
                              {
                                ({getFieldValue})=> {
                                   const values  = getFieldValue([
                                    "scenes",
                                    field.name,
                                  ])?.["tasks"]?.[i.name] ;
                                  console.log(values)
                                  const {timeType, excueTime, timing, excueTime2,taskType} = values
                                  const type = ["开","关"][taskType]
                                  if(timeType==0 && (excueTime || timing)) {
                                    return  <span>{excueTime}{timing}{type}</span>
                                  }else if(timeType==1 && excueTime2) {
                                    return <span> {excueTime2?.format?.("HH:mm")}{type}</span>
                                  }else {
                                   return <span> 时间点{idx + 1}</span> 
                                  }
                                 
                                }
                              }
                            </Form.Item>
                               
                              </CTag>
                            );
                          })}
                        </div>
                      </div>
                      <Link
                        disabled={inerfileds?.length > 3}
                        onClick={() => inmethods.add()}
                      >
                        添加时间点
                      </Link>
                    </div>
                    <div className="contents">
                      {inerfileds?.map?.((inerfiled, index, arr) => (
                        <div className="content" key={inerfiled.key}>
                          <Form.Item
                            label="定时任务"
                            name={[inerfiled.name, "taskType"]}
                            initialValue={0}
                          >
                            <Radio.Group>
                              <Radio value={0}>开</Radio>
                              <Radio value={1}>关</Radio>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item
                            label="时间点设置"
                            name={[inerfiled.name, "timeType"]}
                            initialValue={0}
                          >
                            <Radio.Group>
                              <Radio value={0}>相对值</Radio>
                              <Radio value={1}>固定值</Radio>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item
                            label="时间点"
                            shouldUpdate={(cur, pre) => {                            
                              return (
                                cur["scenes"]?.[field.name]?.["tasks"]?.[
                                  inerfiled.name
                                ]?.timeType !=
                                pre["scenes"]?.[field.name]?.["tasks"]?.[
                                  inerfiled.name
                                ]?.timeType
                              );
                            }}
                          >
                            {({ getFieldValue }) => {
                              let type = getFieldValue([
                                "scenes",
                                field.name,
                              ])?.["tasks"]?.[inerfiled.name]?.timeType;
                             
                              if (type == 0) {
                                return (
                                  <Space>
                                    <Form.Item
                                      name={[inerfiled.name, "excueTime"]}
                                      rules={rules}
                                    >
                                      <Select
                                        options={timeType}
                                        style={{ width: "200px" }}
                                      ></Select>
                                    </Form.Item>
                                    <Form.Item
                                      name={[inerfiled.name, "timing"]}
                                      rules={rules}
                                    >
                                      <InputNumber
                                        min={0}
                                        max={60}
                                        precision={0}
                                        style={{width: "140px"}}
                                        addonAfter="分钟"
                                      ></InputNumber>
                                    </Form.Item>
                                  </Space>
                                );
                              } else {
                                return (
                                  <Form.Item
                                    name={[inerfiled.name, "excueTime2"]}
                                    rules={rules}
                                  ><TimePicker format="HH:mm" />
                                  </Form.Item>
                                );
                              }
                            }}
                          </Form.Item>
                     
                      <Form.Item noStyle   shouldUpdate={(cur, pre) => {                            
                              return (
                                cur["scenes"]?.[field.name]?.["tasks"]?.[
                                  inerfiled.name
                                ]?.taskType !=
                                pre["scenes"]?.[field.name]?.["tasks"]?.[
                                  inerfiled.name
                                ]?.taskType
                              );
                            }}>{
                          ({getFieldValue})=> {
                            let type = getFieldValue([
                              "scenes",
                              field.name,
                            ])?.["tasks"]?.[inerfiled.name]?.taskType;
                          
                          if(type == 0) return <Form.Item
                               label="亮度设置"
                                name={[inerfiled.name, "light"]}
                                labelCol={{flex: "98px"}}
                                rules={[
                                  {
                                    required: type===0
                                  }
                                ]} 
                              ><Cslider step={null} marks={marks} /></Form.Item>
                           
                          }
                            }
                          </Form.Item>
                        </div>
                      ))}
                    </div>
                    {arr.length > 1 && (
                      <img
                        src={imgsrc["del"]}
                        onClick={() => remove(field.name)}
                        className="del"
                      />
                    )}
                  </div>
                );
              }}
            </Form.List>
            </div> 
          ))}
          <Form.Item>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CustButton disabled={fileds?.length >3 } onClick={() => add()}>添加场景</CustButton>
            </div>
          </Form.Item>
        </Scene>
      )}
    </Form.List>
    <Form.Item name="id" initialValue={0} noStyle>
      <Input hidden />
    </Form.Item>
    <Form.Item name="creater" initialValue="">
      <Input hidden></Input>
    </Form.Item>
    <Form.Item name="projectId">
      <Input hidden></Input>
    </Form.Item>
  </>
);


// 线路
export const itemsline = (
  <>
    <Form.Item label="方案名称" name="schemeName" rules={rules} labelAlign="left">
      <Input placeholder="请输入" style={w255}></Input>
    </Form.Item>
    <Form.List name="scenes" initialValue={[{}]}>
      {(fileds, { add, remove }) => (
        <Scene>
          {fileds.map((field, _, arr) => (
            <div>
              <Form.Item
              labelAlign="left"
              style={{marginBottom: "4px"}}
                          label={`场景${new Intl.NumberFormat(
                            "zh-Hans-CN-u-nu-hanidec"
                          ).format(field.name + 1)}`}
                          rules={rules}
                          name={[field.name, "sName"]}
                        ><Select
                            options={options}
                            style={{ width: "200px" }}
                          ></Select>
                        </Form.Item >
            <Form.List name={[field.name, "tasks"]} initialValue={[{}]}>
              {(inerfileds, inmethods) => {                
                return (
                  <div className="scene" key={field.key}>
                    <div className="hander">
                      <div className="list">                      
                        <div className="tags">
                          {inerfileds?.map((i, idx, arr) => {
                            
                            return (
                              <CTag
                                key={i.key}
                                closable={arr.length !== 1}
                                onClose={() => inmethods.remove(i.name)}
                              >
                                <Form.Item noStyle  shouldUpdate={(cur, pre) => {                            
                              return (
                                cur["scenes"]?.[field.name]?.["tasks"]?.[i.name] != pre["scenes"]?.[field.name]?.["tasks"]?.[i.name]
                              );
                            }}>
                              {
                                ({getFieldValue})=> {
                                   const values  = getFieldValue([
                                    "scenes",
                                    field.name,
                                  ])?.["tasks"]?.[i.name] ;
                                  console.log(values)
                                  const {timeType, excueTime, timing, excueTime2,taskType} = values
                                  const type = ["开","关"][taskType]
                                  if(timeType==0 && (excueTime || timing)) {
                                    return  <span>{excueTime}{timing}{type}</span>
                                  }else if(timeType==1 && excueTime2) {
                                    return <span> {excueTime2?.format?.("HH:mm")}{type}</span>
                                  }else {
                                   return <span> 时间点{idx + 1}</span> 
                                  }
                                 
                                }
                              }
                            </Form.Item>
                               
                              </CTag>
                            );
                          })}
                        </div>
                      </div>
                      <Link
                        disabled={inerfileds?.length > 3}
                        onClick={() => inmethods.add()}
                      >
                        添加时间点
                      </Link>
                    </div>
                    <div className="contents">
                      {inerfileds?.map?.((inerfiled, index, arr) => (
                        <div className="content" key={inerfiled.key}>
                          <Form.Item
                            label="定时任务"
                            name={[inerfiled.name, "taskType"]}
                            initialValue={0}
                          >
                            <Radio.Group>
                              <Radio value={0}>开</Radio>
                              <Radio value={1}>关</Radio>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item
                            label="时间点设置"
                            name={[inerfiled.name, "timeType"]}
                            initialValue={0}
                          >
                            <Radio.Group>
                              <Radio value={0}>相对值</Radio>
                              <Radio value={1}>固定值</Radio>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item
                            label="时间点"
                            shouldUpdate={(cur, pre) => {                            
                              return (
                                cur["scenes"]?.[field.name]?.["tasks"]?.[
                                  inerfiled.name
                                ]?.timeType !=
                                pre["scenes"]?.[field.name]?.["tasks"]?.[
                                  inerfiled.name
                                ]?.timeType
                              );
                            }}
                          >
                            {({ getFieldValue }) => {
                              let type = getFieldValue([
                                "scenes",
                                field.name,
                              ])?.["tasks"]?.[inerfiled.name]?.timeType;
                             
                              if (type == 0) {
                                return (
                                  <Space>
                                    <Form.Item
                                      name={[inerfiled.name, "excueTime"]}
                                      rules={rules}
                                    >
                                      <Select
                                        options={timeType}
                                        style={{ width: "200px" }}
                                      ></Select>
                                    </Form.Item>
                                    <Form.Item
                                      name={[inerfiled.name, "timing"]}
                                      rules={rules}
                                    >
                                      <InputNumber
                                        min={0}
                                        max={60}
                                        precision={0}
                                        style={{width: "140px"}}
                                        addonAfter="分钟"
                                      ></InputNumber>
                                    </Form.Item>
                                  </Space>
                                );
                              } else {
                                return (
                                  <Form.Item
                                    name={[inerfiled.name, "excueTime2"]}
                                    rules={rules}
                                  ><TimePicker format="HH:mm" />
                                  </Form.Item>
                                );
                              }
                            }}
                          </Form.Item> 
                          
                      <Form.Item noStyle   shouldUpdate={(cur, pre) => {                            
                              return (
                                cur["scenes"]?.[field.name]?.["tasks"]?.[
                                  inerfiled.name
                                ]?.taskType !=
                                pre["scenes"]?.[field.name]?.["tasks"]?.[
                                  inerfiled.name
                                ]?.taskType
                              );
                            }}>{
                          ({getFieldValue})=> {
                            let type = getFieldValue([
                              "scenes",
                              field.name,
                            ])?.["tasks"]?.[inerfiled.name]?.taskType;
                          
                          if(type == 0) return <Form.Item
                               label="亮度设置"
                                name={[inerfiled.name, "light"]}
                                labelCol={{flex: "98px"}}
                                rules={[
                                  {
                                    required: type===0
                                  }
                                ]} 
                              ><Cslider step={null} marks={marks} /></Form.Item>
                            
                          }
                            }
                          </Form.Item>
                        </div>
                      ))}
                    </div>
                    {arr.length > 1 && (
                      <img
                        src={imgsrc["del"]}
                        onClick={() => remove(field.name)}
                        className="del"
                      />
                    )}
                  </div>
                );
              }}
            </Form.List>
            </div> 
          ))}
          <Form.Item>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CustButton disabled={fileds?.length >3 } onClick={() => add()}>添加场景</CustButton>
            </div>
          </Form.Item>
        </Scene>
      )}
    </Form.List>
    <Form.Item name="id" initialValue={0} noStyle>
      <Input hidden />
    </Form.Item>
    <Form.Item name="creater" initialValue="">
      <Input hidden></Input>
    </Form.Item>
    <Form.Item name="projectId">
      <Input hidden></Input>
    </Form.Item>
  </>
);
export const colsline = [
  //
  {
    title: "方案名称",
    dataIndex: "strategyName",
    key: "strategyName",
  },
  {
    title: "场景",
    dataIndex: "sceneDesc",
    key: "sceneDesc",
  },
  {
    title: "绑定线路数",
    dataIndex: "bindNum",
    key: "bindNum",
  },
  {
    title: "创建人",
    dataIndex: "creater",
    key: "creater",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
  },
];
export const bindlinecol =[
  {
    title: "线路名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "绑定路灯数",
    dataIndex: "lightNum",
    key: "lightNum",
  },
  
]