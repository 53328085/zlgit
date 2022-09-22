import {Space} from 'antd'
export const  columns = [
    {
        title: '最新报告时间',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '最新告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
      },
      {
        title: '所属项目',
        dataIndex: 'customer',
        key: 'customer',
      },
      {
        title: '所属区域/建筑/楼层',
        dataIndex: 'place',
        key: 'place',
      },
      {
        title: '安装地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '设备类型',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: '设备编号',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '操作',
        key: 'option',
        align:'center',
        render:(_,val)=>(
            <a style={{color:'red',textDecoration:'underline'}}>派单</a>
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
