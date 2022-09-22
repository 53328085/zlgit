export const columns =[
     {
        title: '电压(V)',
        children:[
            {
                title:'A相',
                dataIndex:'AVolt',
                key:'AVolt',
                align:'center',
            },
            {
                title:'B相',
                dataIndex:'BVolt',
                key:'BVolt',
                align:'center',
            }, {
                title:'C相',
                dataIndex:'CVolt',
                key:'CVolt',
                align:'center',
            }
        ]
      },
      {
        title: '电流(A)',
        children:[
            {
                title:'A相',
                dataIndex:'ACurrent',
                key:'ACurrent',
                align:'center',
            },
            {
                title:'B相',
                dataIndex:'BCurrent',
                key:'NCurrent',
                align:'center',
            }, {
                title:'C相',
                dataIndex:'CCurrent',
                key:'CCurrent',
                align:'center',
            }
        ]
      },
      {
        title: <div ><div>总有功功率</div><div>(kW)</div></div>,
        dataIndex: 'customer',
        key: 'customer',
        align:'center'
      },
      {
        title: <div ><div>总无功功率</div><div>(kvar)</div></div>,
        dataIndex: 'customer',
        key: 'customer',
        align:'center'
      },
      {
        title: <div ><div>总视在功率</div><div>(kVA)</div></div>,
        dataIndex: 'customer',
        key: 'customer',
        align:'center'
      },
      {
        title: <div ><div>总负荷</div><div>(kW)</div></div>,
        dataIndex: 'customer',
        key: 'customer',
        align:'center'
      },
      {
        title: <div ><div>总负荷率</div><div>(kW)</div></div>,
        dataIndex: 'customer',
        key: 'customer',
        align:'center'
      },
      {
        title: '功率因素',
        dataIndex: 'customer',
        key: 'customer',
        align:'center'
      },
      {
        title: '温度',
        dataIndex: 'customer',
        key: 'customer',
        align:'center'
      },
      {
        title: '风机状态',
        dataIndex: 'customer',
        key: 'customer',
        align:'center'
      },
      {
        title: '设备详情',
        dataIndex: 'customer',
        key: 'customer',
        align:'center',
        render: (_, record) => (
                    <a  style={{textDecoration:'underline'}}>查看详情</a>
                ),
      },
   
]