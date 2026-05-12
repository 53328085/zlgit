import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Space, Drawer, Flex } from 'antd';
import UserTable from '@com/useTable';
import { useSelector } from 'react-redux';
import { adaptation } from '@redux/systemconfig';
import { useReactive } from 'ahooks';
import { head } from 'lodash';

const deviceColumns = [
  {
    title: '设备编号',
    dataIndex: 'sn',
    key: 'sn',
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '安装地址',
    dataIndex: 'address',
    key: 'address',
  },
];

export default function DeviceShareDrawer({
  open,
  onClose = null,
  projectId,
  deviceStyles
}) {
  const [form] = Form.useForm();
  const searchParams = useReactive({
    type: 0,
    alike: '',
  })
  const laptop = useSelector(adaptation) || {}
  const [deviceTypeOptions, setDeviceTypeOptions] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (!open) return;
    const options = [...deviceStyles.filter(item => [1, 2, 3, 5, 7, 8, 12, 18].includes(item.deviceStyle))]
    setDeviceTypeOptions(options)
    form.setFieldsValue({
      type: head(options)?.deviceStyle,
    })
  }, [open, deviceStyles])



  /**
   * 处理抽屉关闭
   */
  const handleClose = () => {
    onClose ? onClose() : setDrawerOpen(false);
    form.resetFields();
  };

  return (
    <Drawer
      width={laptop ? 1200 : 1400}
      onClose={handleClose}
      open={open}
      closable={false}
      destroyOnHidden
    >
      <Flex align='center' gap={12}>
        <Flex gap={12} vertical style={{ width: '50%', height: '100%' }}>
          <span>设备选择(单选)</span>
          <Form form={form} layout='inline' style={{ gap: 12 }}>
            <Form.Item label="设备类型" name="type">
              <Select
                style={{ width: 120 }}
                onChange={(value) => searchParams.type = value}
                fieldNames={{ label: 'name', value: 'deviceStyle' }}
                options={deviceTypeOptions}
              />
            </Form.Item>
            <Form.Item name="alike" label="设备搜索">
              <Input.Search
                allowClear
                placeholder="输入设备编号/安装地址/设备名称"
                onSearch={(value) => searchParams.alike = value}
                style={{ width: 290 }}
              />
            </Form.Item>
          </Form>
          <UserTable
            rowKey="id"
            columns={deviceColumns}
            rowSelection={{
              selectedRowKey,
              onChange: setSelectedRowKey
            }}
            dataSource={tableData}
          />
        </Flex>
      </Flex>
    </Drawer>
  );
}