import {Space} from 'antd'
import { NavLink, useLocation, useNavigate } from "react-router-dom"

// const navigate = useNavigate()
export const  columns = [
    {
        title: '告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        align:'center',
      },
      {
        title: '告警事件',
        dataIndex: 'alarmEvent',
        key: 'alarmEvent',
        align:'center',
      },
      {
        title: '消警时间',
        dataIndex: 'recoveryTime',
        key: 'recoveryTime',
        align:'center',
      },
      {
        title: '消警事件',
        dataIndex: 'recoveryEvent',
        key: 'recoveryEvent',
        align:'center',
      },
      {
        title: '告警状态',
        dataIndex: 'status',
        key: 'status',
        align:'center',
        render:(text)=>(<span>{text===1?'告警':'消警'}</span>)
      },
      {
        title: '告警等级',
        dataIndex: 'level',
        key: 'level',
        align:'center',
      },
      {
        title: '设备编号',
        dataIndex: 'sn',
        key: 'sn',
        align:'center',
      },
      {
        title: '设备类型',
        dataIndex: 'meterType',
        key: 'meterType',
        align:'center',
      },
      {
        title: '安装地址',
        dataIndex: 'address',
        key: 'address',
        align:'center',
      },
 
      {
        title: '设备信息',
        key: 'option',
        align:'center',
        render:(_,val)=>(
            <a style={{textDecoration:'underline'}}
             href="/devicedetail" target="blank" 
            //  onClick={()=>{navigate("/devicedetail",{state: {title: '告警详情', nested: 'alarmDetail', primary: 'runtimeSafe'}})}}
             >设备信息</a>
        ),
      },

]
