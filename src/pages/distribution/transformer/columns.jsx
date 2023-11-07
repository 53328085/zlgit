
import {Link} from 'react-router-dom'
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
        title: <div ><div>负荷率</div><div>(kW)</div></div>,
        dataIndex: 'LoadPer',
        key: 'LoadPer',
        align:'center'
      },
      {
        title: '功率因素',
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
export const devicecolumns=[ {
  title: '时间',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
},, {
  title: 'A相电流',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
},, {
  title: 'B相电流',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
},, {
  title: 'C相电流',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
},, {
  title: 'A相电压',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
},, {
  title: 'B相电压',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
},, {
  title: 'C相电压',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
},, {
  title: '有功功率',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
},, {
  title: '无功功率',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
}, {
  title: '视在功率',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
},  {
  title: '负荷',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
},
{
  title: '负荷率',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
}, {
  title: '温度',
  dataIndex: 'customer',
  key: 'customer',
  align:'center'
},]

