import ProTable from '@ant-design/pro-table';

export default function MyTable(){
  // 假设这是你的所有数据
  const data = [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    // ... 更多数据
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '姓名', dataIndex: 'name' },
  ];

  return (
    <ProTable
      columns={columns}
      dataSource={data} // 使用 dataSource 传入全部数据
      pagination={false} // 关键：设置为 false 以禁用分页
      rowKey="id"
    />
  );
};