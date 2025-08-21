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
import { CSlider, Scene, CTag,  } from "./style";
import imgsrc from "@svgs/index";
import { CustButton } from "@com/useButton";
const { Link } = Typography;


 
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
export const w255 = { width: "255px" };