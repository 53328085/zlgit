import {useMemo} from 'react'
import {Typography} from 'antd' 
import moment from 'moment'
const {Link} = Typography
export   function useCols(callback) {
   return useMemo(()=> {
     return [
      {
        title: "方案名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "绑定路灯数",
        dataIndex: "bindNum",
        key: "bindNum",
        render:(t,r)=> <Link onClick={()=>callback({id: r.id, result:0})}>{t}</Link>
      },
      {
        title: "控制成功路灯数",
        dataIndex: "success",
        key: "success",
        render:(t,r)=> <Link onClick={()=>callback({id: r.id, result:1})}>{t}</Link>
      },
      {
        title: "控制失败路灯数",
        dataIndex: "fail",
        key: "fail",
        render:(t,r)=> <Link type="danger" onClick={()=>callback({id: r.id, result:2})}>{t}</Link>
      },
      {
        title: "控制成功率(%)",
        dataIndex: "rate",
        key: "rate",
        render: (text) => Number.isFinite(parseFloat(text)) ? text : "-"
      },
      {
        title: "执行时间",
        dataIndex: "excuteTime",
        key: "excuteTime",
        render: (text) => moment(text,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")
      }, 
      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime",
      }, 
      
      
    ];
   }, [callback])
} 
export const tabs =[
  { key: '0', label: '自动控制' },
  { key: '1', label: '手动控制' },
]
export const lightcol =[
    {
      title: "园区名称",
      dataIndex: "areaName",
      key: "areaName",
    },
    {
      title: "路灯名称",
      dataIndex: "lightName",
      key: "lightName",
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
      title: "所属控制器编号",
      dataIndex: "cSn",
      key: "cSn",
    },
    {
      title: "在线状态",
      dataIndex: "state",
      key: "state",
      render: (t)=>{ t<1 ? "离线" : "正常" }
       
    },
    {
      title: "安装地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "路灯类型",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },
]
export const result =[
  { value: '0', label: '全部' },
  { value: '1', label: '成功' },
  { value: '2', label: '失败' },
]
export const state =[
  { value: '0', label: '全部' },
  { value: '1', label: '离线' },
  { value: '2', label: '在线' },
]
 export const disabledDate = (current) => {
    
    return   current > moment().endOf('day');
  };
  export const manualcol =[
    {
      title: "设备名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "通信地址",
      dataIndex: "csn",
      key: "csn",
    },
    {
      title: "安装地址",
      dataIndex: "address",
      key: "address",
    },
   /*  {
      title: "操作类型",
      dataIndex: "",
      key: "",
    }, */
    {
      title: "亮度",
      dataIndex: "brightness",
      key: "brightness",
    },
    {
      title: "在线状态",
      dataIndex: "state",
      key: "state",
      render: (t)=>  t<1 ? "离线" :  "正常"
    }, 
    
    {
      title: "操作人",
      dataIndex: "operater",
      key: "operater",
    },
    {
      title: "控制状态",
      dataIndex: "resultDesc",
      key: "resultDesc",
    },
    {
      title: "操作时间",
      dataIndex: "excuteTime",
      key: "excuteTime",
    },
]