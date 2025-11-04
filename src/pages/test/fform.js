import { Card, List } from 'antd';
import React from 'react';
const data = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
];
const App = () => (
  <List
    grid={{
      gutter: 16,
      xxl:4,
      xl: 3,
      lg: 2,
      md: 2,
      sm: 1,
      xs: 1,
    }}
    dataSource={data}
    renderItem={(item) => (
      <List.Item>
        <Card title={item.title}>Card content</Card>
      </List.Item>
    )}
  />
);
export default App;