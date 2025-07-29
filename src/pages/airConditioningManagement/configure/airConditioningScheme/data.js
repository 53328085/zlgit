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
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { CSlider, Scene, CTag,  } from "./style";
import imgsrc from "@svgs/index";
import { CustButton } from "@com/useButton";
const { Link } = Typography;


const Custslider = ({value, onChange, ...rest}) => {
  console.log(value)
  const vchange = (e) => { 
    onChange(e)
  }
  return (
    <CSlider value={value} onChange={vchange} {...rest}></CSlider>
  )


}
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
    dataIndex: "bindLightNum",
    key: "bindLightNum",
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

export const section =({ cusac, setcusac, params })=> (
  <Form.List name="section" initialValue={[{}]}>
  {(fileds, { add,remove }) => {
    return (
      <div className="formboxwrap">
        <div className="header">
          <div className="list">
            <div className="tags">
              {fileds?.map((i, idx, arr) => {
                return (
                  <CTag
                    key={i.key}
                    closable={arr.length !== 1 || arr.length>64}
                    onClose={() => {
                      setcusac(0)
                      remove(i.name)
                    }}
                   onClick={()=> {
                    setcusac(i.name)
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
                        const name = getFieldValue(["section", i.name ])?.["sectionName"];
                         
                        if (name) {
                          return (
                            <span className={cusac==i.name ? "active" : ""}>
                               {name}
                            </span>
                          );
                        }else {
                          return <span className={cusac==i.name ? "active" : ""}>方案{new Intl.NumberFormat(
                            "zh-Hans-CN-u-nu-hanidec"
                          ).format(idx + 1)}区间</span>;
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
            onClick={() => add(params, fileds?.length) }
          >
           添加时间区间
          </Link>
        </div>
        {fileds.map(({key, name, ...rest}) => (
          <div className="formbox" style={{ columnGap: "64px", display: name==cusac? "" : "none"}} key={key}> 
              <Form.Item label="区间名称" rules={rules} name={[name, "sectionName"]}>
                <Input style={w255} />
              </Form.Item>
              <Form.Item label="时间设置" rules={rules} name={[name, "date"]}>
                <DatePicker.RangePicker></DatePicker.RangePicker>
              </Form.Item> 
              <Form.Item   name={[name, "type"]}>
                <Radio.Group options={timeType}></Radio.Group>
              </Form.Item>
              <Form.Item  noStyle  shouldUpdate={(cur, pre)=>cur.section[name]?.type!=pre.section[name]?.type}>
                 {
                   ({getFieldValue, setFieldValue})=> {
                      let type = getFieldValue(["section",name])?.type
                      const allchange=(e)=> { 
                         if(e.target.checked) {                         
                           setFieldValue(["section",name, "weeks"], [1,2,3,4,5,6,0])
                         }else {
                          setFieldValue(["section",name, "weeks"], null)
                         }
                      }
                      const onChange=(v) => {
                        setFieldValue(["section",name, "checked"], v?.length==7)
                      }
                      if(type==1) {
                        return <Space>
                          <Form.Item noStyle name={[name,"checked" ]} valuePropName="checked">
                             <Checkbox onChange={allchange}>全选</Checkbox>
                          </Form.Item>
                          <Form.Item name={[name, "weeks"]}>
                            <Checkbox.Group options={weeks} onChange={onChange}></Checkbox.Group>
                         </Form.Item>
                        </Space>
                      }else {
                        return <Form.Item>
                          <Checkbox>法定节假日</Checkbox>
                        </Form.Item>
                      }
                   }
                 }
              </Form.Item>
                      
            
          </div>
        ))}
      </div>
    );
  }}
</Form.List>
)

 
