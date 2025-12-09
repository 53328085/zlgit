import {
  Form,
  Select,
  Input,
  Slider,
  Radio,
  InputNumber,
  DatePicker,
  Typography,
  Tag,
  Space,
  Checkbox,
  Tooltip,
  TimePicker,
} from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import { CSlider, Scene, CTag } from "./style";
import imgsrc from "@svgs/index";
import { CustButton } from "@com/useButton";
const { Link , Text} = Typography;

export const cols = [
  //
  {
    title: "方案名称",
    dataIndex: "strategyName",
    key: "strategyName",
  },
  {
    title: "方案应用周期",
    dataIndex: "strategiesDesc",
    key: "strategiesDesc",
  },
  {
    title: "绑定空调数",
    dataIndex: "bindConditionerNum",
    key: "bindConditionerNum",
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
export const bindcol = [
  {
    title: "空调名称",
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
];
export const rules = [
  {
    required: true,
  },
];
export const w255 = { width: "255px" }; //0：道路灯 1：高杆路灯 2：太阳能路灯 3：景观灯
const weeks = [
  { label: "周一", value: 1 },
  { label: "周二", value: 2 },
  { label: "周三", value: 3 },
  { label: "周四", value: 4 },
  { label: "周五", value: 5 },
  { label: "周六", value: 6 },
  { label: "周日", value: 0 },
];
const timeType = [
  { label: "应用星期", value: 1 },
  { label: "特殊日期设置", value: 2 },
];

const timingopt = [
  { label: "开", value: 1 },
  { label: "关", value: 2 },
];
const forbidopt = [
  { label: "禁止启动", value: 1 },
  { label: "禁止关闭", value: 2 },
];
const wokeType = [
  { label: "制冷", value: 1 },
  { label: "制热", value: 2 },
  { label: "送风", value: 3 },
  { label: "除湿", value: 4 },
];
const windSpeed = [
  { label: "自动", value: 0 },
  { label: "低", value: 1 },
  { label: "中", value: 2 },
  { label: "高", value: 3 },
];

/* 
"tempAllow": true,  // 温度限制
        "coldLower": 18, 制冷
        "coldUpper": 29,
        "hotLower": 10,制热
        "hotUpper": 16,

        "airTemperatureColse": true, // 合理控温
        "lowTemp": 10, 低于
        "highTemp": 10 高于

*/
export const section = ({
  cusac,
  setcusac,
  cusac1 = 0,
  setcusac1,
  cusac2 = 0,
  setcusac2,
  params,
}) => (
  <Form.List name="section" initialValue={[{}]}>
    {(fileds, { add, remove }) => {
      return (
        <div className="formboxwrap" key="section">
          <div className="header">
            <div className="list">
              <div className="tags">
                {fileds?.map((i, idx, arr) => {
                  return (
                    <CTag
                      key={i.key}
                      style={{width: "155px"}}
                      closable={arr.length !== 1 || arr.length > 64}
                      onClose={() => {
                     
                       let active = fileds.filter(f=>f.name!=i.name)?.[0]?.name 
                   
                        setcusac(active);
                        setcusac1({[active]:0})
                        setcusac2({[active]:0})
                        remove(i.name);
                      }}
                      onClick={() => {
                        setcusac(i.name);
                        setcusac1({[i.name]:0})
                        setcusac2({[i.name]:0})
                      }}
                    >
                      <Form.Item
                        noStyle
                        shouldUpdate={(cur, pre) => {
                          return (
                            cur["section"]?.[i.name]?.["sectionName"] !=
                            pre["section"]?.[i.name]?.["sectionName"]
                          );
                        }}
                      >
                        {({ getFieldValue }) => {
                          const name = getFieldValue(["section", i.name])?.[
                            "sectionName"
                          ];

                          if (name) {
                            return (
                              <Text className={cusac == i.name ? "active" : ""} ellipsis={{tooltip:name}}>
                                {name}
                              </Text>
                            );
                          } else {
                            return (
                              <span className={cusac == i.name ? "active" : ""} >
                                方案
                                {new Intl.NumberFormat(
                                  "zh-Hans-CN-u-nu-hanidec"
                                ).format(idx + 1)}
                                区间
                              </span>
                            );
                          }
                        }}
                      </Form.Item>
                    </CTag>
                  );
                })}
              </div>
            </div>
            <Link
              disabled={fileds?.length > 64}
              onClick={() => {
                let name=parseInt(fileds[fileds.length - 1]?.name) + 1

                setcusac(name);
                setcusac1({[name]:0})
                setcusac2({[name]:0})
                add(params, fileds?.length)
              }}
            >
              添加时间区间
            </Link>
          </div>
          {fileds.map((filed) => (
            <div
              className="formbox"
              style={{
                columnGap: "64px",
                display: filed.name == cusac ? "" : "none",
              }}
              key={filed.key}
            >
              <Form.Item
                label="区间名称"
                rules={rules}
                name={[filed.name, "sectionName"]}
              >
                <Input style={w255} />
              </Form.Item>
              <Form.Item label="时间设置" rules={rules} name={[filed.name, "date"]}>
                <DatePicker.RangePicker style={w255}></DatePicker.RangePicker>
              </Form.Item>
              <Form.Item name={[filed.name, "type"]} initialValue={1}>
                <Radio.Group options={timeType}></Radio.Group>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(cur, pre) =>
                  cur.section[filed.name]?.type != pre.section[filed.name]?.type
                }
              >
                {({ getFieldValue, setFieldValue }) => {
                  let type = getFieldValue(["section", filed.name])?.type;
                  const allchange = (e) => {
                    if (e.target.checked) {
                      setFieldValue(
                        ["section", filed.name, "weeks"],
                        [1, 2, 3, 4, 5, 6, 0]
                      );
                    } else {
                      setFieldValue(["section", filed.name, "weeks"], null);
                    }
                  };
                  const onChange = (v) => {
                    setFieldValue(["section", filed.name, "checked"], v?.length == 7);
                  };
                  if (type == 1) {
                    return (
                      <Space>
                        <Form.Item
                          name={[filed.name, "checked"]}
                          valuePropName="checked"
                        >
                          <Checkbox onChange={allchange}>全选</Checkbox>
                        </Form.Item>
                        <Form.Item name={[filed.name, "weeks"]}>
                          <Checkbox.Group
                            options={weeks}
                            onChange={onChange}
                          ></Checkbox.Group>
                        </Form.Item>
                      </Space>
                    );
                  } else {
                    return (
                      <Form.Item name={[filed.name, "weeks"]} valuePropName="checked"  >
                        <Checkbox>
                          法定节假日
                          <Tooltip title="获取国家法定节假日信息,可设置法定节假日的控制策略">
                            <InfoCircleFilled />
                          </Tooltip>
                        </Checkbox>
                      </Form.Item>
                    );
                  }
                }}
              </Form.Item>
              <Form.Item name={[filed.name, "eTiming"]} valuePropName="checked">
                        <Checkbox>定时开关</Checkbox>
                      </Form.Item>
              <Form.List
                name={[filed.name, "timings"]}
                initialValue={[{}]}
              >
                {(tfileds, tmethod) => {
                  return (
                    <div className="formboxwrap inbox" key={`timings${tfileds.name}`}>
                     
                      <div className="header">
                        <div className="list">
                          <div className="tags">
                            {tfileds?.map((i, idx, arr) => {
                              return (
                                <CTag
                                  key={i.key}
                                  closable={arr.length !== 1 || arr.length > 64}
                                  onClose={() => {
                                    console.log(tfileds)
                                    console.log(tfileds.filter(f=>f.name!=i.name))
                                    let active = tfileds.filter(f=>f.name!=i.name)?.[0]?.name 
                                    
                                    setcusac1({[filed.name]:active});
                                    tmethod.remove(i.name);
                                  }}
                                  onClick={() => {
                                   setcusac1({[filed.name]: i.name});
                                  }}
                                >
                                  <Form.Item
                                    noStyle
                                    shouldUpdate={(cur, pre) => cur["section"][filed.name]?.["timings"]?.[i.name]!= pre["section"][filed.name]?.["timings"]?.[i.name]   }
                                  >
                                    {({ getFieldValue }) => {
                                      let values = getFieldValue(["section",filed.name,])?.["timings"]?.[i.name] ;
                                      const {type, time} = values
                                      const name = type == 1 ? "开启":"关闭"
                                      const stime = time?.format?.("HH:mm") || "--"
                                     /*  const name =
                                        getFieldValue(["timings", i.name])?.[
                                          "type"
                                        ] === 1
                                          ? "开启"
                                          : "关闭";
                                      const time =
                                        getFieldValue(["timings", i.name])?.[
                                          "time"
                                        ]?.format?.("HH:mm") || "--"; */
                                      return (
                                        <Text
                                          ellipsis={{tooltip: stime + name}}
                                          className={
                                            cusac1[filed.name] == i.name ? "active" : ""
                                          }
                                        >
                                          {stime} {name}  
                                        </Text>
                                      );
                                    }}
                                  </Form.Item>
                                </CTag>
                              );
                            })}
                          </div>
                        </div>
                        <Link 
                          onClick={() => {
                            console.log(tfileds)
                            let name = parseInt(tfileds[tfileds?.length-1]?.name) + 1   
                            console.log(name)                         
                            setcusac1({[filed.name]: name});
                            tmethod.add({type:1}, tfileds?.length)
                          }}
                        >
                          添加
                        </Link>
                      </div>
                      {tfileds.map(({ key, name, ...rest }) => (
                        <div
                          className="formbox"
                          style={{ columnGap: "64px", display: name== cusac1[filed.name] ? "" : "none", }}
                          key={name}
                        >
                          <Form.Item
                            label="定时任务"
                            name={[name, "type"]}
                            initialValue={1}
                          >
                            <Radio.Group
                              options={timingopt}
                              optionType="button"
                              buttonStyle="solid"
                            ></Radio.Group>
                          </Form.Item>
                          <Form.Item label="时间点设置" name={[name, "time"]}>
                            <TimePicker style={w255} format="HH:mm" />
                          </Form.Item>
                          <Form.Item shouldUpdate={(cur, pre)=> { 
                              return  cur["section"]?.[filed.name]?.["timings"]?.[name]?.type !==pre["section"]?.[filed.name]?.["timings"]?.[name]?.type
                            }}>
                          {
                            ({getFieldValue})=> {
                                  let type = getFieldValue(["section",filed.name,])?.["timings"]?.[name]?.type                                
                                  if (type==1) {
                                    return <>
                          <Form.Item
                            label="工作模式"
                            name={[name, "workMode"]}
                            initialValue={1}
                          >
                            <Radio.Group options={wokeType}></Radio.Group>
                          </Form.Item>
                          <Form.Item
                            label="风速设置"
                            name={[name, "windSpeed"]}
                            initialValue={1}
                          >
                            <Radio.Group
                              options={windSpeed}
                              optionType="button"
                              buttonStyle="solid"
                            ></Radio.Group>
                          </Form.Item>
                          <Form.Item
                            label="温度设置"
                            name={[name, "temperature"]}
                          >
                            <InputNumber
                              min={16}
                              max={30}
                              addonAfter="℃"
                              style={w255}
                            ></InputNumber>
                          </Form.Item>
                          </>
                                  }else {
                              return  null
                            }
                          
                          }
                        }
                          
                          </Form.Item>
                        {/*   <Form.Item label=" " name={[name, "temperature"]}>
                            <Slider
                              min={15}
                              max={35}
                              range={{ draggableTrack: true }}
                              style={w255}
                            />
                          </Form.Item> */}
                        </div>
                      ))}
                    </div>
                  );
                }}
              </Form.List>
              <Form.Item name={[filed.name, "eForbid"]} valuePropName="checked">
                        <Checkbox>禁止开关</Checkbox>
                      </Form.Item>
              <Form.List
                name={[filed.name, "forbidControls"]}
                initialValue={[{}]}
              >
                {(ffileds, fmethod) => {
                  return (
                    <div className="formboxwrap noboder" key="forbidControls">
                     
                      <div className="header">
                        <div className="list">
                          <div className="tags">
                            {ffileds?.map((i, idx, arr) => {
                              return (
                                <CTag
                                  style={{width: "155px"}}
                                  key={i.key}
                                  closable={arr.length !== 1 || arr.length > 64}
                                  onClose={() => {
                                    let active = ffileds.filter(f=>f.name!=i.name)?.[0]?.name 

                                    setcusac2({[filed.name]:active});
                                  
                                    fmethod.remove(i.name);
                                  }}
                                  onClick={() => {
                                    setcusac2({[filed.name]: i.name});
                                  }}
                                >
                                  <Form.Item
                                    noStyle
                                    shouldUpdate={(cur, pre) => cur["section"][filed.name]?.["forbidControls"]?.[i.name]!= pre["section"][filed.name]?.["forbidControls"]?.[i.name] }
                                  >
                                    {({ getFieldValue }) => {
                                       let values = getFieldValue(["section",filed.name,])?.["forbidControls"]?.[i.name] ;
                                       
                                       const {type, time} = values
                                       const name = type == 1 ? "禁止启动": "禁止关闭"
                                       const time1 = time?.[0]?.format("HH:mm") || "--";
                                       const time2 = time?.[1]?.format("HH:mm") || "--";
                                       const text = time1 + "-" + time2;                                    
                                      return (
                                        <span 
                                          className={
                                            cusac2[filed.name] == i.name ? "active" : "" }>
                                        {text} {name}
                                        </span>
                                      );
                                    }}
                                  </Form.Item>
                                </CTag>
                              );
                            })}
                          </div>
                        </div>
                        <Link 
                          onClick={() => {
                            let name = parseInt(ffileds[ffileds?.length-1]?.name) + 1
                            setcusac2({[filed.name]: name});
                            fmethod.add(params, ffileds?.length)
                          }}
                        >
                          添加
                        </Link>
                      </div>
                      {ffileds.map(({ key, name, ...rest }) => (
                        <div
                          className="formbox"
                          style={{ columnGap: "64px", display: name== cusac2[filed.name] ? "" : "none", }}
                          key={name}
                        >
                          <Form.Item
                            label="禁止状态"
                            name={[name, "type"]}
                            initialValue={1}
                          >
                            <Radio.Group
                              options={forbidopt}
                              optionType="button"
                              buttonStyle="solid"                              
                            ></Radio.Group>
                          </Form.Item>
                          <Form.Item label="时间段设置" name={[name, "time"]}>
                            <TimePicker.RangePicker
                              style={w255}
                              format="HH:mm"
                            />
                          </Form.Item>
                        </div>
                      ))}
                    </div>
                  );
                }}
              </Form.List>
            </div>
          ))}
        </div>
      );
    }}
  </Form.List>
);

export const timings = ({ cusac1, setcusac1, params }) => (
  <Form.List name="timings" initialValue={[{}]}>
    {(fileds, { add, remove }) => {
      return (
        <div className="formboxwrap" key="timings">
          <Form.Item name={["timings", "eTiming"]}>
            <Checkbox>定时开关</Checkbox>
          </Form.Item>
          <div className="header">
            <div className="list">
              <div className="tags">
                {fileds?.map((i, idx, arr) => {
                  return (
                    <CTag
                      key={i.key}
                      closable={arr.length !== 1 || arr.length > 64}
                      onClose={() => {
                        setcusac1(0);
                        remove(i.name);
                      }}
                      onClick={() => {
                        setcusac1(i.name);
                      }}
                    >
                      <Form.Item
                        noStyle
                        shouldUpdate={(cur, pre) => {
                          let curtime =
                            cur["timings"]?.[i.name]?.["time"]?.format?.(
                              "HH:mm"
                            );
                          let pretime =
                            pre["timings"]?.[i.name]?.["time"]?.format?.(
                              "HH:mm"
                            );
                          return (
                            cur["timings"]?.[i.name]?.["type"] !=
                              pre["timings"]?.[i.name]?.["type"] ||
                            curtime !== pretime
                          );
                        }}
                      >
                        {({ getFieldValue }) => {
                          const name =
                            getFieldValue(["timings", i.name])?.["type"] === 1
                              ? "开启"
                              : "关闭";
                          const time =
                            getFieldValue(["timings", i.name])?.[
                              "time"
                            ]?.format?.("HH:mm") || "--";
                          return (
                            <Text className={cusac1 == i.name ? "active" : ""} ellipsis={{tooltip: time + name}}>
                              {time} {name}
                            </Text>
                          );
                        }}
                      </Form.Item>
                    </CTag>
                  );
                })}
              </div>
            </div>
            <Link
              disabled={fileds?.length > 64}
              onClick={() => add(params, fileds?.length)}
            >
              添加
            </Link>
          </div>
          {fileds.map(({ key, name, ...rest }) => (
            <div
              className="formbox"
              style={{
                columnGap: "64px",
                display: name == cusac1 ? "" : "none",
              }}
              key={key}
            >
              <Form.Item
                label="定时任务"
                name={[name, "type"]}
                initialValue={1}
              >
                <Radio.Group
                  options={timingopt}
                  optionType="button"
                  buttonStyle="solid"
                ></Radio.Group>
              </Form.Item>
              <Form.Item label="时间点设置" name={[name, "time"]}>
                <TimePicker style={w255} format="HH:mm" />
              </Form.Item>
              <Form.Item
                label="工作模式"
                name={[name, "workMode"]}
                initialValue={1}
              >
                <Radio.Group options={wokeType}></Radio.Group>
              </Form.Item>
              <Form.Item
                label="风速设置"
                name={[name, "windSpeed"]}
                initialValue={1}
              >
                <Radio.Group
                  options={windSpeed}
                  optionType="button"
                  buttonStyle="solid"
                ></Radio.Group>
              </Form.Item>
              <Form.Item label="温度设置" name={[name, "temperature"]}>
                <InputNumber
                  min={16}
                  max={30}
                  addonAfter="℃"
                  style={w255}
                ></InputNumber>
              </Form.Item>
            {/*   <Form.Item label=" " name={[name, "temperature"]}>
                <Slider
                  min={16}
                  max={30}
                  range={{ draggableTrack: true }}
                  style={w255}
                />
              </Form.Item> */}
            </div>
          ))}
        </div>
      );
    }}
  </Form.List>
);

export const forbidControls = ({ cusac2, setcusac2, params }) => (
  <Form.List name="forbidControls" initialValue={[{}]}>
    {(fileds, { add, remove }) => {
      return (
        <div className="formboxwrap" key="forbidControls">
          <Form.Item name={["forbidControls", "eForbid"]}>
            <Checkbox>禁止开关</Checkbox>
          </Form.Item>
          <div className="header">
            <div className="list">
              <div className="tags">
                {fileds?.map((i, idx, arr) => {
                  return (
                    <CTag
                      key={i.key}
                      closable={arr.length !== 1 || arr.length > 64}
                      onClose={() => {
                        setcusac2(0);
                        remove(i.name);
                      }}
                      onClick={() => {
                        setcusac2(i.name);
                      }}
                    >
                      <Form.Item
                        noStyle
                        shouldUpdate={(cur, pre) => {
                          let curtime =
                            cur["forbidControls"]?.[i.name]?.["time"];
                          let pretime =
                            pre["forbidControls"]?.[i.name]?.["time"];
                          let equality =
                            curtime?.[0]?.format?.("HH:mm") !=
                              pretime?.[0]?.format?.("HH:mm") ||
                            curtime?.[1]?.format?.("HH:mm") !=
                              pretime?.[1]?.format?.("HH:mm");
                          return (
                            cur["forbidControls"]?.[i.name]?.["type"] !=
                              pre["forbidControls"]?.[i.name]?.["type"] ||
                            equality
                          );
                        }}
                      >
                        {({ getFieldValue }) => {
                          const name =
                            getFieldValue(["forbidControls", i.name])?.[
                              "type"
                            ] === 1
                              ? "禁止启动"
                              : "禁止关闭";
                          const time = getFieldValue([
                            "forbidControls",
                            i.name,
                          ])?.["time"];
                          const time1 = time?.[0]?.format("HH:mm") || "--";
                          const time2 = time?.[1]?.format("HH:mm") || "--";
                          const text = time1 + "-" + time2;
                          return (
                            <span className={cusac2 == i.name ? "active" : ""}>
                              {text} {name}
                            </span>
                          );
                        }}
                      </Form.Item>
                    </CTag>
                  );
                })}
              </div>
            </div>
            <Link
              disabled={fileds?.length > 64}
              onClick={() => add(params, fileds?.length)}
            >
              添加
            </Link>
          </div>
          {fileds.map(({ key, name, ...rest }) => (
            <div
              className="formbox"
              style={{
                columnGap: "64px",
                display: name == cusac2 ? "" : "none",
              }}
              key={key}
            >
              <Form.Item
                label="禁止状态"
                name={[name, "type"]}
                initialValue={1}
              >
                <Radio.Group
                  options={forbidopt}
                  optionType="button"
                  buttonStyle="solid"
                ></Radio.Group>
              </Form.Item>
              <Form.Item label="时间段设置" name={[name, "time"]}>
                <TimePicker.RangePicker style={w255} format="HH:mm" />
              </Form.Item>
            </div>
          ))}
        </div>
      );
    }}
  </Form.List>
);

const marks = {
  16: "16",
  30: "30",
};
const w60 = {
  width: "60px",
};
export const esaving = (
  <div className="formboxwrap" key="esaving">
    <div className="header">
      注：节能策略设置用于节能电量统计，请根据实际情况合理设置。
    </div>
    <div className="formboxwrap md8">
      <Form.Item
        name={["esaving", "tempAllow"]}
        valuePropName="checked"
        initialValue={false}
      >
        <Checkbox>温度限制</Checkbox>
      </Form.Item>
      <div className="formbox bgcolor">
        <Form.Item
          label="空调处于制冷模式时，温度上下限（℃）"
          labelCol={{ flex: "20em" }}
          name={["esaving", "cold"]}
          initialValue={[16, 30]}
        >
          <Slider
            marks={marks}
            range={{ draggableTrack: true }}
            min={16}
            max={30}
          />
        </Form.Item>
        <Form.Item
          label="空调处于制热模式时，温度上下限（℃）"
          labelCol={{ flex: "20em" }}
          name={["esaving", "hight"]}
          initialValue={[16, 30]}
        >
          <Slider
            marks={marks}
            range={{ draggableTrack: true }}
            min={16}
            max={30}
          />
        </Form.Item>
      </div>
      <Form.Item
        name={["esaving", "airTemperatureColse"]}
        valuePropName="checked"
        initialValue={false}
      >
        <Checkbox>合理控温</Checkbox>
      </Form.Item>
      <div className="formbox bgcolor">
        <div className="temp">
          <span>当室外(内)温度低于</span>
          <Form.Item name={["esaving", "lowTemp"]}>
            <InputNumber min={0} max={30} style={w60} />
          </Form.Item>
          <span>℃,且空调处于制冷模式，自动关闭空调。</span>
        </div>
        <div className="temp">
          <span>当室外(内)温度高于</span>
          <Form.Item name={["esaving", "highTemp"]}>
            <InputNumber min={0} max={30} style={w60} />
          </Form.Item>
          <span>℃,且空调处于制热模式，自动关闭空调。</span>
        </div>
      </div>
    </div>
  </div>
);
