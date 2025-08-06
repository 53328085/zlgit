import {Image, Form, Select, Typography, Input} from 'antd'
import Cupload from "@com/useUpload.js" 
export  const cols =[ // 实时抄表  
    {
      title: '设备型号',
      dataIndex: 'model', 
      key:'model',
    },
    {
      title: '设备厂家',
      dataIndex: 'manufacturer', 
      key:'manufacturer',
    },
    {
      title: '设备缩略图',
      dataIndex: 'image', 
      key:'image',
      render: (text) => <Image src={text} />
    },
    {
      title: '当前设备数量',
      dataIndex: 'currentNum', 
      key:'currentNum',
    }, 
  ]
  const options =[
    {
        label: "GMV-252WM/X",
        value: "GMV-252WM/X"
    },
    {
        label: "离柜式KFR-50LW/F1Y型号",
        value: "离柜式KFR-50LW/F1Y型号"
    },
  ]
  const checkLog = (_, value) => {   
    if (!!value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(t("common:Logouploadmust")));
   
 }
  export const items = (
    <>
     <Form.Item label="空调型号" name="model" rules={[{
        required: true
     }]}>
        <Select options={options}></Select>
     </Form.Item>
     <Form.Item label="生产厂家" name="manufacturer" rules={[{
        required: true
     },{
        whitespace: true
     }]}>
       <Input allowClear></Input>
     </Form.Item>
     <Form.Item label="缩略图" name="image" rules={[
              {
                validator: checkLog,
              },
            ]}>
        <Cupload wpx={136} hpx={136} swpx={120} shpx={90} style={{padding: '16px'}}    />
     </Form.Item>
     <Form.Item>
        <Typography.Text>（图片尺寸136*136px，容量小于100KB）</Typography.Text>
     </Form.Item> 
     <Form.Item name="id" initialValue={0} noStyle>
        <Input hidden></Input>
     </Form.Item>
    </>
  )