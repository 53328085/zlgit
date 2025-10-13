export const tabs=[
    {key:"1",label:'负载率分析'},
    {key:"2",label:'数据监测'},
]
export const opts = [
    {
      value:1,
      label:'电压(V)'},
    {
      value:2,
      label:'电流(A)'},
    {
      value:3,
      label:'总负荷(kW)'},
    {
      value:4,
      label:'总有功功率(kW)'},
    {
      value:5,
      label:'总无功功率(kVar)'},
    {
      value:6,
      label:'总视在功率(kVA)'},
    {
      value:7,
      label:'总功率因数'},
  ]
  export const columns =[
    {
       title: '电压(V)',
       children:[
           {
               title:'A相',
               dataIndex:'Ua',
               key:'Ua',
               align:'center',
           },
           {
               title:'B相',
               dataIndex:'Ub',
               key:'Ub',
               align:'center',
           }, {
               title:'C相',
               dataIndex:'Uc',
               key:'Uc',
               align:'center',
           }
       ]
     },
     {
       title: '电流(A)',
       children:[
           {
               title:'A相',
               dataIndex:'Ia',
               key:'Ia',
               align:'center',
           },
           {
               title:'B相',
               dataIndex:'Ib',
               key:'Ib',
               align:'center',
           }, {
               title:'C相',
               dataIndex:'Ic',
               key:'Ic',
               align:'center',
           }
       ]
     },
     {
       title: <div ><div>有功功率</div><div>(kW)</div></div>,
       dataIndex: 'TotW',
       key: 'TotW',
       align:'center'
     },
     {
       title: <div ><div>无功功率</div><div>(kvar)</div></div>,
       dataIndex: 'TotVar',
       key: 'TotVar',
       align:'center'
     },
     {
       title: <div ><div>视在功率</div><div>(kVA)</div></div>,
       dataIndex: 'TotVA',
       key: 'TotVA',
       align:'center'
     },
     {
       title: <div ><div>负荷</div><div>(kW)</div></div>,
       dataIndex: 'Load',
       key: 'Load',
       align:'center'
     },
     {
       title: <div ><div>负荷率</div><div>(%)</div></div>,
       dataIndex: 'LoadPer',
       key: 'LoadPer',
       align:'center'
     },
     {
       title: '功率因数',
       dataIndex: 'TotPF',
       key: 'TotPF',
       align:'center'
     },
     {
       title: '温度',
       dataIndex: 'Tmp',
       key: 'Tmp',
       align:'center'
     },
     {
       title: '风机状态',
       dataIndex: 'Fan',
       key: 'Fan',
       align:'center'
     },
     {
       title: '设备详情',
       dataIndex: 'customer',
       key: 'customer',
       align:'center',
       render: (_, record) => (
                   <a  style={{textDecoration:'underline'}} target='_blank' href={`/deviceDetail?sn=${record.sn}`}>查看详情</a>
               ),
     },
  
]