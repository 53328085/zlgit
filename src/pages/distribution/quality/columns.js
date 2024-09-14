export const columns = [{
        title: '',
        dataIndex: 'type',
        key: 'type',
        width: 80,
    },
    {
        title: '有效值（V）',
        dataIndex: 'yxz',
        key: 'yxz',
    },
    {
        title: '波动（v）',
        dataIndex: 'bd',
        key: 'bd',
    },
    {
        title: '波动频次(次/min)',
        dataIndex: 'bdpc',
        key: 'bdpc',
    },
    {
        title: '偏差(%)',
        dataIndex: 'pc',
        key: 'pc',
    },
    {
        title: '短闪变',
        dataIndex: 'dsb',
        key: 'dsb',
    },
    {
        title: '长闪变',
        dataIndex: 'csb',
        key: 'csb',
    },
    {
        title: '总谐波畸变率 (%)',
        dataIndex: 'zxbjbl',
        key: 'zxbjbl',
    },
    {
        title: '奇次谐波总畸变率 (%)',
        dataIndex: 'jcxbzjbl',
        key: 'jcxbzjbl',
    },
    {
        title: '偶次谐波总畸变率 (%)',
        dataIndex: 'ocxbzjbl',
        key: 'ocxbzjbl',
    },
]

export const columns2 = [ // 电压
    {
        title: '',
        dataIndex: 'type',
        key: 'type',
        width: 80,
    },
    {
        title: '有效值（V）',
        dataIndex: 'yxz',
        key: 'yxz',
    },
    {
        title: '不平衡度 (%)',
        dataIndex: 'bphd',
        key: 'bphd',
    },
]
export const columns3 = [ //电流
    {
        title: '',
        dataIndex: 'type',
        key: 'type',
        width: 80,
    },
    {
        title: '有效值（V）',
        dataIndex: 'yxz',
        key: 'yxz',
    },
    {
        title: '总谐波畸变率(%)',
        dataIndex: 'zxbjbl',
        key: 'zxbjbl',
    },
]
export const columns4 = [ //电流
    {
        title: '',
        dataIndex: 'type',
        key: 'type',
        width: 80,
    },
    {
        title: '有效值（V）',
        dataIndex: 'yxz',
        key: 'yxz',
    },
    {
        title: '不平衡度(%)',
        dataIndex: 'bphd',
        key: 'bphd',
    },
]
export const columns5 = [ // 分相功率
    {
        title: '',
        dataIndex: 'type',
        key: 'type',
        width: 80,
    },
    {
        title: '有效值（V）',
        dataIndex: 'yxz',
        key: 'yxz',
    },
    {
        title: '波动（v）',
        dataIndex: 'bd',
        key: 'bd',
    },
    {
        title: '波动频次(次/min)',
        dataIndex: 'bdpc',
        key: 'bdpc',
    },
]
export const columns6 = [ // 有功，无功，视在

    {
        title: '有功(kW)',
        dataIndex: 'yg',
        key: 'yg',
    },
    {
        title: '无功(kVar)',
        dataIndex: 'wg',
        key: 'bd',
    },
    {
        title: '视在(kVA)',
        dataIndex: 'sz',
        key: 'sz',
    },
]
export const columns7 = [ // 功率因数

    {
        title: '功率因数',
        dataIndex: 'gvys',
        key: 'gvys',
    },

]
export const columns8 = [ // 频率

    {
        title: '频率',
        dataIndex: 'pl',
        key: 'pl',
    },

]
export const columns9 = [ // 频率偏差

    {
        title: '频率偏差',
        dataIndex: 'plpc',
        key: 'plpc',
    },

]
export const wtqxcolumns= [ // 稳态曲线

    {
        title: '参数',
        dataIndex: 'param',
        key: 'param',
    },
    {
        title: '最大值',
        children:[
             {
                title: '数值',
                dataIndex: 'Thd_Max',
                key: 'Thd_Max',
           },
           {
            title: '发生时间',
            dataIndex: 'Thd_MaxTime',
            key: 'Thd_MaxTime',
         }
       ]
       
    },
    {
        title: '最小值',
        children:[
             {
                title: '数值',
                dataIndex: 'Thd_Max',
                key: 'Thd_Max',
           },
           {
            title: '发生时间',
            dataIndex: 'Thd_MaxTime',
            key: 'Thd_MaxTime',
         }
       ]
       
    },
    {
        title: '视在(kVA)',
        dataIndex: 'sz',
        key: 'sz',
    },
]