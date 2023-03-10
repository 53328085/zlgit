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
            render:(t,r,i)=>(<img src={'data:image/jpeg;base64,'+t} width="64px" height="53px" alt=""></img>)
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
            dataIndex: 'category'
        },
        {
            title:'设备厂家',
            dataIndex: 'manufacturer'
        },
        {
            title:'设备缩略图',
            dataIndex: 'imageBase64'
        },
        {
            title:'当前设备数量',
            dataIndex: 'cnt'
        },
        {
            title:'操作',
            dataIndex: 'options'
        }
    ],
   
]