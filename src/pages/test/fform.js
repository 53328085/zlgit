import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Button } from 'antd';
import React from 'react';
const { Meta } = Card;
const App = () => (
  <Card
    style={{
      width: 300,
    }}
    title="多媒体"
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
   bodyStyle={{fontSize: "12px"}}
   headStyle={{fontSize: "14px"}}
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
      <Button>删除</Button>
    ]}
  >
    <Meta
      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
      title="Card title"
      description="This is the description"
    />
  </Card>
);
export default App;