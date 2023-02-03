 import {ScanOutlined} from '@ant-design/icons'
 const Micon = () => {
    return <span className="custicon">&#9673;</span>
 }

/* {
       // index: true,
        path: 'deviceType',
        element: <DeviceType/>
     },
     {
         path: 'device',
         element: <Device/>
     },
     {
        path: 'lighting',
        element: <Lighting/>
    },
    {
        path: 'line',
        element: <Line/>
    },    
    {
        path: 'warning',
        element: <Warning/>
    }, */


 export  const monitoringConf = [ // 运行监控
    {
      label: '设备类型管理' ,
      key: "deviceType",
      icon: <Micon />
    },
    {
      label: '设备管理',
      key: "device",
      icon: <Micon />
    },    
    {
        label: "公共照明",
        key: "lighting",
        icon: <Micon />
    },
    {
        label: "线路管理",
        key: "line",
        icon: <Micon />
    },
    {
        label: "告警管理",
        key: "warning",
        icon: <Micon />
    },
   
   ]



   export  const energy = [ // 能源管理
    {
      label: '能源概述' ,
      key: "summary",
      icon: <Micon />
    },
    {
      label: '综合能耗',
      key: "synthetical",
      icon: <Micon />
    },
    {
      label: '能耗费用',
      key: "cost",
      icon: <Micon />
    },
    {
      label: "能耗排名",
      key: "ranking",
      icon: <Micon />
    },
    {
        label: "分时能耗",
        key: "timesharing",
        icon: <Micon />
       
    },
    {
        label: "能耗用量",
        key: "usage",
        icon: <Micon />
      
    },
    {
        label: "能耗流向",
        key: "direction",
        icon: <Micon />
       
    },
    {
        label: "损耗分析",
        key: "analysis",
        icon: <Micon />
    },  
    {
        label: "定额能耗",
        key: "quota",
        icon: <Micon />
    },
    {
        label: "公共能耗",
        key: "comm",
        icon: <Micon />
    },
    {
      label: "路灯监控",
      key: "streetLamp",
      icon: <Micon />
    },
    {
      label: "公共照明",
      key: "lighting",
      icon: <Micon />
   },
   ]
   export  const devops = [ // 运维管理
    {
      label: '运维概述' ,
      key: "summary",
      icon: <Micon />
    },
    {
      label: '告警信息',
      key: "warning",
      icon: <Micon />
    },
    {
      label: '工单管理',
      key: "order",
      icon: <Micon />
    },
    {
      label: "巡检管理",
      key: "inspection",
      icon: <Micon />
    },
    {
        label: "运行报告",
        key: "runing",
        icon: <Micon />
       
    },
   ]
   export  const electric = [ // 电气安全
    {
      label: '安全概述' ,
      key: "safe",
      icon: <Micon />
    },
    {
      label: '告警信息',
      key: "warning",
      icon: <Micon />
    },
   ]

   export  const distribution = [ // 配电管理
    {
      label: '配电概述' ,
      key: "summary",
      icon: <Micon />
    },
    {
      label: '配电系统图',
      key: "map",
      icon: <Micon />
    },
    {
      label: '变压器监测',
      key: "transformer",
      icon: <Micon />
    },
    {
      label: '回路监测',
      key: "loop",
      icon: <Micon />
    },
    {
      label: '环境监测',
      key: "surroundings",
      icon: <Micon />
    },
    {
      label: '视频监控',
      key: "video",
      icon: <Micon />
    },
    {
      label: '告警信息',
      key: "warning",
      icon: <Micon />
    },
    {
      label: '运行报告',
      key: "report",
      icon: <Micon />
    },
   ]

   export  const prepayment = [ // 结算收费
   {
     label: '概述' ,
     key: "summary",
     icon: <Micon />
   },
   {
     label: '客户管理',
     key: "customer",
     icon: <Micon />
   },
   {
     label: '能源收费',
     key: "charge",
     icon: <Micon />
   },
   {
     label: '物业收费',
     key: "property",
     icon: <Micon />
   },
   {
     label: '账单报表',
     key: "bill",
     icon: <Micon />
   },
   {
     label: '数据报表',
     key: "data",
     icon: <Micon />
   },
   {
     label: '手动抄表',
     key: "reading",
     icon: <Micon />
   },
   {
    label: '充值补助',
    key: "recharge",
    icon: <Micon />
   },
   {
     label: '运行报告',
     key: "run",
     icon: <Micon />
   },
  ]
  export  const photovoltaic = [ // 光伏发电
  {
    label: '概述' ,
    key: "summary",
    icon: <Micon />
  },
  {
    label: '运行监控',
    key: "monitor",
    icon: <Micon />
  },
  {
    label: '数据分析',
    key: "analysis",
    icon: <Micon />
  },
  {
    label: '环境监测',
    key: "surroundings",
    icon: <Micon />
  },
  {
    label: '告警监控',
    key: "warn",
    icon: <Micon />
  },
  {
    label: '运行报告',
    key: "run",
    icon: <Micon />
  },
  
 ]


 export  const carbon = [ // 碳排管理
 {
   label: '运行监控',
   key: "monitor",
   icon: <Micon />
 },
]
export  const module = [ // 公共模块
{
  label: '项目管理' ,
  key: "project",
  icon: <Micon />
},
{
  label: '用户管理',
  key: "user",
  icon: <Micon />
},
{
  label: '区域管理',
  key: "region",
  icon: <Micon />
},
/* {
  label: '档案管理',
  key: "file",
  icon: <Micon />
},
{
  label: '能耗分类',
  key: "energy",
  icon: <Micon />
},
{
  label: '能源定价',
  key: "pricing",
  icon: <Micon />
}, */
{
  label: '数字驾驶舱',
  key: "cockpit",
  icon: <Micon />
},

]
