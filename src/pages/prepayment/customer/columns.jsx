export const columns=[
    {
        title: '客户编号',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '客户姓名',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
      },
      {
        title: '手机号',
        dataIndex: 'customer',
        key: 'customer',
      },
      {
        title: '客户地址',
        dataIndex: 'place',
        key: 'place',
      },
      {
        title: '能源费账户余额',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '物业费账户余额',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: '账户状态',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '保电方案',
        key: 'option',
        align:'center',
        render:(_,val)=>(
            <a style={{color:'red',textDecoration:'underline'}}>派单</a>
        ),
      },
      {
        title: '告警方案',
        key: 'deteail',
        align:'center',
        render: (_, record) => (
            <a  style={{textDecoration:'underline'}}>详情</a>
        ),
      },
      {
        title: '备注',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '操作',
        dataIndex: 'sn',
        key: 'sn',
      },
]

export const devicecolumns=[
    {
        title: '设备变更时间',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '客户编号',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
      },
      {
        title: '客户姓名',
        dataIndex: 'customer',
        key: 'customer',
      },
      {
        title: '手机号',
        dataIndex: 'place',
        key: 'place',
      },
      {
        title: '客户地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '设备类型',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: '新设备编号',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '新设备型号',
        key: 'option',
        align:'center',
        render:(_,val)=>(
            <a style={{color:'red',textDecoration:'underline'}}>派单</a>
        ),
      },
      {
        title: '新设备初始读数',
        key: 'deteail',
        align:'center',
        render: (_, record) => (
            <a  style={{textDecoration:'underline'}}>详情</a>
        ),
      },
      {
        title: '旧设备编号',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '旧设备型号',
        dataIndex: 'sn',
        key: 'sn',
      },
]