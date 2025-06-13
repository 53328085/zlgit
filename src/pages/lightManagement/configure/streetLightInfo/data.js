export const lightType= ["道路灯","高杆路灯","太阳能路灯","景观灯"]
export const cols =[ // 实时抄表  
    {
      title: '园区名称',
      dataIndex: 'areaName', 
      key:'areaName',
    },
    {
      title: '路灯名称',
      dataIndex: 'name', 
      key:'name',
    },
    {
      title: '路灯型号',
      dataIndex: 'model', 
      key:'model',
    },
    {
      title: '路灯编号',
      dataIndex: 'no', 
      key:'no',
    },
    {
      title: '所属计量设备',
      dataIndex: 'mSn', 
      key:'mSn',
    },
    {
      title: '所属控制器编号',
      dataIndex: 'cSn', 
      key:'cSn',
    },
    {
      title: '安装地址',
      dataIndex: 'address', 
      key:'address',
    },
    {
      title: '路灯类型',
      dataIndex: 'type', 
      key:'type',
      render: (type)=>lightType[type]
    },
    {
      title: '备注',
      dataIndex: 'remark', 
      key:'remark',
    },
  ]
  export const rules =[{
    required: true
  }]
  export const w224= {width: "224px"}    //0：道路灯 1：高杆路灯 2：太阳能路灯 3：景观灯
  export const options =[
    {label: "道路灯", value: 0},
    {label: "高杆路灯", value: 1},
    {label: "太阳能路灯", value: 2},
    {label: "景观灯", value: 3},
    {label: "其他", value: 4},

  ]
  