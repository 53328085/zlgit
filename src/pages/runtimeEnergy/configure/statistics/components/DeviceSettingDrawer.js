import React, { useState, useCallback } from 'react';
import { Form, Input, Select, Space, message, Drawer, Flex, Typography } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import UserTable from '@com/useTable';
import { Area } from '@api/api.js';
import { CustButton, CustButtonT } from '@com/useButton';
import { components } from './DraggableView';
import { useAddSummaryDeviceOrder, useAddSubDeviceOrder } from '../api';
import { useSelector } from 'react-redux';
import { adaptation } from '@redux/systemconfig';
import { getDeviceSettingColumns } from '../Constant';

export default function DeviceSettingDrawer({
  open,// 是否打开抽屉
  onClose = null,// 抽屉关闭回调
  projectId,// 项目ID
  areaId,// 区域ID
  areaName,// 区域名称
  deviceStyles,// 设备样式
}) {
  // 设备配置表单
  const [form] = Form.useForm()
  // 总表设备
  const [deviceSummary, setDeviceSummary] = useState([])
  // 分表设备
  const [deviceSub, setDeviceSub] = useState([])
  // 未选中设备
  const [unselected, setUnselected] = useState([])
  // 设备类型
  const [deviceType, setDeviceType] = useState(0)
  // 选中的总表设备
  const [selectedSummaryKeys, setSelectedSummaryKeys] = useState([])
  // 选中的分表设备
  const [selectedSubKeys, setSelectedSubKeys] = useState([])
  // 选中的未选中设备
  const [selectedUnselectedKeys, setSelectedUnselectedKeys] = useState([])
  // 是否为笔记本
  const laptop = useSelector(adaptation) || {}
  // 设备引用
  const devicesRef = React.useRef({
    unselected: [],
    deviceSummary: [],
    deviceSub: [],
  });

  /**
   * 获取未选中设备
   */
  const getUnselectedDevices = async ({ type = deviceType, areaId: currentAreaId, alike = '' } = {}) => {
    try {
      if (!currentAreaId) return;
      const { success, data } = await Area.QueryUnusedMeter({
        projectId,
        type,
        areaId: currentAreaId,
        alike,
      });
      if (success && Array.isArray(data)) {
        setUnselected([...data]);
        devicesRef.current.unselected = data;
      } else {
        setUnselected([]);
        devicesRef.current.unselected = [];
      }
    } catch (error) {
      console.error('获取未选中设备失败:', error);
    }
  };

  /**
   * 获取已选中设备
   */
  const getSelectedDevices = async ({ areaId: currentAreaId, type = deviceType }) => {
    try {
      if (!currentAreaId) return;
      const { success, data } = await Area.QueryUsedMeter({ projectId, type, areaId: currentAreaId });
      if (success) {
        const { deviceSummary: summary = [], deviceSub: sub = [] } = data || {};
        setDeviceSummary([...summary]);
        devicesRef.current.deviceSummary = summary;
        setDeviceSub([...sub]);
        devicesRef.current.deviceSub = sub;
      } else {
        setDeviceSummary([]);
        devicesRef.current.deviceSummary = [];
        setDeviceSub([]);
        devicesRef.current.deviceSub = [];
      }
    } catch (error) {
      console.error('获取已选中设备失败:', error);
    }
  };

  /**
   * 刷新设备列表
   */
  const refreshDevices = async () => {
    if (!areaId) return;
    await getUnselectedDevices({ areaId });
    await getSelectedDevices({ areaId });
  };

  /**
   * 监听抽屉打开状态变化
   */
  React.useEffect(() => {
    if (open && areaId) {
      refreshDevices();
    }
  }, [open, areaId]);

  /**
   * 处理搜索
   */
  const handleSearch = (value, type) => {
    const searchValue = value.trim().toLowerCase();
    if (!searchValue) {
      if (type === 0) {
        setDeviceSummary([...devicesRef.current.deviceSummary]);
      } else {
        setDeviceSub([...devicesRef.current.deviceSub]);
      }
      return;
    }

    const filterFn = (item) => {
      return (
        (item.sn && item.sn.toLowerCase().includes(searchValue)) ||
        (item.address && item.address.toLowerCase().includes(searchValue)) ||
        (item.name && item.name.toLowerCase().includes(searchValue))
      );
    };

    if (type === 0) {
      setDeviceSummary(devicesRef.current.deviceSummary.filter(filterFn));
    } else {
      setDeviceSub(devicesRef.current.deviceSub.filter(filterFn));
    }
  };

  /**
   * 处理设备类型变化
   */
  const handleDeviceTypeChange = (value) => {
    setDeviceType(value);
    getUnselectedDevices({ areaId, type: value });
    getSelectedDevices({ areaId, type: value });
  };

  /**
   * 处理移动设备
   */
  const handleMove = async (type) => {
    if (!areaId) return;
    let selected = [];
    switch (type) {
      case 1:
        selected = unselected.filter((item) => selectedUnselectedKeys.includes(item.id));
        break;
      case 2:
        selected = deviceSummary.filter((item) => selectedSummaryKeys.includes(item.id));
        break;
      case 3:
        selected = unselected.filter((item) => selectedUnselectedKeys.includes(item.id));
        break;
      case 4:
        selected = deviceSub.filter((item) => selectedSubKeys.includes(item.id));
        break;
      default:
        return;
    }
    if (selected.length < 1) {
      message.warning('请选择设备', 2);
      return;
    }
    if (type === 2 || type === 4) setSelectedUnselectedKeys([]);
    if (type === 1) setSelectedSummaryKeys([]);
    if (type === 3) setSelectedSubKeys([]);

    const params = selected.map((s) => s.sn);
    const handlers = ['', 'AddSummaryDevice', 'RemoveSummaryDevice', 'AddSubDevice', 'RemoveSubDevice'];
    const handler = handlers[type];
    try {
      const { success, errMsg } = await Area[handler](projectId, areaId, params);
      if (success) {
        await refreshDevices();
      } else {
        message.error(errMsg || '数据出错', 2);
      }
    } catch (error) {
      message.error('操作失败', 2);
    }
  };

  /**
   * 处理保存排序
   */
  const handleSaveOrder = async (type = 0) => {
    if (!areaId) return;

    const orderDevices = type === 0
      ? deviceSummary.map((item, idx) => ({ sn: item.sn, order: idx + 1 }))
      : deviceSub.map((item, idx) => ({ sn: item.sn, order: idx + 1 }));

    const body = {
      projectId,
      areaId,
      orderDevices,
    };

    try {
      const { success, errMsg } = type === 0
        ? await useAddSummaryDeviceOrder({}, body)
        : await useAddSubDeviceOrder({}, body);

      if (success) {
        message.success(type === 0 ? '总表保存成功' : '分表保存成功');
        await refreshDevices();
      } else {
        message.error(errMsg || '数据错误');
      }
    } catch (error) {
      console.error('保存排序失败:', error);
      message.error('保存失败');
    }
  };

  /**
   * 处理移动总表设备
   */
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = deviceSummary[dragIndex];
      setDeviceSummary(
        update(deviceSummary, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [deviceSummary],
  );

  /**
   * 处理移动分表设备
   */
  const moveRowSub = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = deviceSub[dragIndex];
      setDeviceSub(
        update(deviceSub, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [deviceSub],
  );

  /**
   * 总表设备选择器
   */
  const summaryRowSelection = {
    selectedRowKeys: selectedSummaryKeys,
    onChange: (keys) => {
      setSelectedSummaryKeys(keys);
    },
  };

  /**
   * 处理分表设备选择
   */
  const subRowSelection = {
    selectedRowKeys: selectedSubKeys,
    onChange: (keys) => {
      setSelectedSubKeys(keys);
    },
  };

  /**
   * 处理移动未选中设备
   */
  const unselectedRowSelection = {
    selectedRowKeys: selectedUnselectedKeys,
    onChange: (keys) => {
      setSelectedUnselectedKeys(keys);
    },
  };

  /**
   * 处理抽屉关闭
   */
  const handleClose = () => {
    onClose ? onClose() : setDrawerOpen(false);
    form.resetFields();
    setSelectedSummaryKeys([]);
    setSelectedSubKeys([]);
    setSelectedUnselectedKeys([]);
  };

  return (
    <Drawer
      width={laptop ? 1200 : 1400}
      onClose={handleClose}
      open={open}
      closable={false}
      destroyOnHidden
    >
      <Typography.Title level={4}>当前区域：{areaName}</Typography.Title>
      <Flex align='center' gap={16} style={{ height: 'calc(100% - 60px)' }}>
        <Flex gap={16} vertical style={{ width: '38%', height: '100%' }}>
          <Flex vertical style={{ flex: 1, border: '1px solid #e5e5e5', padding: 12 }} gap={12}>
            <Flex align='center' justify='space-between'>
              <span>总表</span>
              <CustButtonT text="save" onClick={() => handleSaveOrder(0)} />
            </Flex>
            <Input.Search
              allowClear
              onPressEnter={(e) => handleSearch(e.target.value, 0)}
              placeholder="输入设备编号/安装地址/设备名称"
              onSearch={(value) => handleSearch(value, 0)}
              style={{ width: 300 }}
            />
            <DndProvider backend={HTML5Backend}>
              <UserTable
                columns={getDeviceSettingColumns()}
                rowSelection={summaryRowSelection}
                dataSource={deviceSummary}
                components={components}
                onRow={(_, index) => ({
                  index,
                  moveRow,
                })}
                rowKey="id"
                scroll={{
                  x: 'max-content',
                  y: 'calc(50vh - 180px)'
                }}
              />
            </DndProvider>
          </Flex>
          <Flex vertical style={{ flex: 1, border: '1px solid #e5e5e5', padding: 12 }} gap={12}>
            <Flex align='center' justify='space-between'>
              <span>分表</span>
              <CustButtonT text="save" onClick={() => handleSaveOrder(1)} />
            </Flex>
            <Input.Search
              allowClear
              onPressEnter={(e) => handleSearch(e.target.value, 1)}
              placeholder="输入设备编号/安装地址/设备名称"
              onSearch={(value) => handleSearch(value, 1)}
              style={{ width: 300 }}
            />
            <DndProvider backend={HTML5Backend}>
              <UserTable
                columns={getDeviceSettingColumns()}
                rowSelection={subRowSelection}
                dataSource={deviceSub}
                components={components}
                onRow={(_, index) => ({
                  index,
                  moveRow: moveRowSub,
                })}
                rowKey="id"
                scroll={{
                  x: 'max-content',
                  y: 'calc(50vh - 180px)'
                }}
              />
            </DndProvider>
          </Flex>
        </Flex>
        <Flex
          vertical
          justify='center'
          align='center'
          gap={24}
        >
          <div>
            <p>选择总表</p>
            <Space>
              <CustButton
                icon={<LeftOutlined />}
                onClick={() => handleMove(1)}
                style={{ height: 32, width: 55 }}
              />
              <CustButton
                icon={<RightOutlined />}
                onClick={() => handleMove(2)}
                style={{ height: 32, width: 55 }}
              />
            </Space>
          </div>
          <div>
            <p>选择分表</p>
            <Space>
              <CustButton
                icon={<LeftOutlined />}
                onClick={() => handleMove(3)}
                style={{ height: 32, width: 55 }}
              />
              <CustButton
                icon={<RightOutlined />}
                onClick={() => handleMove(4)}
                style={{ height: 32, width: 55 }}
              />
            </Space>
          </div>
          <Space>
            <CustButtonT text="cancel" onClick={handleClose} style={{ height: 34, width: 120 }} />
          </Space>
        </Flex>
        <Flex gap={12} vertical style={{ width: 'calc(62% - 154px)', height: '100%' }}>
          <span>未选中的设备</span>
          <Form form={form} initialValues={{ type: 0 }}>
            <Space size={16}>
              <Form.Item label="设备类型" name="type">
                <Select
                  style={{ width: 120 }}
                  onChange={handleDeviceTypeChange}
                  defaultValue={deviceType}
                  fieldNames={{ label: 'name', value: 'deviceStyle' }}
                  options={
                    deviceStyles?.length > 0
                      ? [{ deviceStyle: 0, name: '全部类型' }, ...deviceStyles]
                      : []
                  }
                />
              </Form.Item>
              <Form.Item name="alike" label="设备搜索">
                <Input.Search
                  allowClear
                  placeholder="输入设备编号/安装地址/设备名称"
                  onSearch={(value) => getUnselectedDevices({ areaId, alike: value })}
                  style={{ width: 290 }}
                />
              </Form.Item>
            </Space>
          </Form>
          <UserTable
            columns={getDeviceSettingColumns()}
            rowSelection={unselectedRowSelection}
            dataSource={unselected}
            rowKey="id"
            scroll={{
              x: 'max-content',
              y: 'calc(100vh - 240px)'
            }}
          />
        </Flex>
      </Flex>
    </Drawer>
  );
}