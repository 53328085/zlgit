export const columns = [
    {
        title: '设备编号',
        dataIndex:'sn'
    },
    {
        title: '设备状态',
        dataIndex:'accountType',
    },
    {
        title: '设备类型',
        dataIndex:'deviceType',
        render:(val)=><span>{val===1?'电表':val==='2'?'水表':'燃气表'}</span>
    },
    {
        title: '设备型号',
        dataIndex:'categoryName'
    },
    {
        title: '客户编号',
        dataIndex:'customerNo'
    },
    {
        title: '姓名',
        dataIndex:'customerName'
    },
  
    {
        title: '手机号',
        dataIndex:'customerMobile'
    },
    {
        title: '安装地址',
        dataIndex:'address'
    }, {
        title: '开关状态',
        dataIndex:'status',
        render: (val)=><span>{!val?'未知':val[1]==='Close'?'合闸':'开闸'}</span>
    }, {
        title: '保电方案',
        dataIndex:'powerProtectSolution'
    }, {
        title: '告警方案',
        dataIndex:'alarmSolution'
    }, {
        title: '账户余额',
        dataIndex:'balanceEnergy'
    },
    {
        title: '账户状态',
        dataIndex:'accountType'
    }
]