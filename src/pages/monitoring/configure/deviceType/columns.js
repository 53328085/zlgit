import { render } from "less";

export default [
    [
        {
            title: '网关型号',
            dataIndex: 'category',
            key:'category'
          },
          {
            title: '网关缩略图',
            dataIndex: 'imageBase64',
            key:'imageBase64',
            render:(t,r,i)=>(<img src={'data:image/jpeg;base64,'+t} width="64px" alt=""></img>)
          },
          {
            title: '已用网关数量',
            dataIndex: 'cnt',
            key:'cnt'
          },
          {
            title: '操作',
            dataIndex: 'options',
            key:'options',
          },
    ],
    [
        {
            title:'设备型号',
            dataIndex: 'device-type'
        },
        {
            title:'设备厂家',
            dataIndex: 'device-factory'
        },
        {
            title:'设备缩略图',
            dataIndex: 'device-img'
        },
        {
            title:'当前设备数量',
            dataIndex: 'device-num'
        },
        {
            title:'操作',
            dataIndex: 'options'
        }
    ],
    [
        {
            title:'监控设备型号',
            dataIndex: 'monitor-type'
        },
        {
            title:'监控设备厂家',
            dataIndex: 'monitor-factory'
        },
        {
            title:'监控设备型号',
            dataIndex: 'monitor-model'
        },
        {
            title:'视频监控缩略图',
            dataIndex: 'monitor-img'
        },
        {
            title:'已用传感器数量',
            dataIndex: 'usemonitor-num'
        },{}
    ]
]