import {Space} from 'antd'
export const  columns = [
    {
        title: '最新告警时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '告警详情',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '设备编号',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '设备型号',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '安装地址',
        dataIndex: 'address',
        key: 'address',
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
