import {Space} from 'antd'
export const  columns = [
    {
        title: '最新告警时间',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '最新告警事件',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
      },
      {
        title: '告警等级',
        dataIndex: 'customer',
        key: 'customer',
      },
      {
        title: '设备编号',
        dataIndex: 'place',
        key: 'place',
      },
      {
        title: '设备类型',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '安装地址',
        dataIndex: 'category',
        key: 'category',
      },
 
      {
        title: '设备信息',
        key: 'option',
        align:'center',
        render:(_,val)=>(
            <a style={{color:'red',textDecoration:'underline'}}>设备信息</a>
        ),
      },
      {
        title: '设备详情',
        key: 'deteail',
        align:'center',
        render: (_, record) => (
            <a  style={{textDecoration:'underline'}}>详情</a>
        ),
      },
]
