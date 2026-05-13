import React, { useState, useCallback } from 'react';
import { Form, Input, Select, Space, message, Flex, Typography } from 'antd';
import CModal from '@com/useModal';
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
import styled from 'styled-components';

const LeftContentView = styled(Flex)`
  width: calc(62% - 120px);
  height: 100%;
  background: rgba(229,236,245,0.5);
  border-radius: 6px;
  padding: 10px;

  .title{
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 14px;
    color: #303133;
    line-height: 20px;
    text-align: left;
    font-style: normal;
  }
  .table-content{
    flex: 1;
    padding: 12px 16px;
    background: #fff;
    border-radius: 6px;
  }  
`

const RightContentView = styled(Flex)`
  width: 38%;
  height: 100%;

  .title{
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 14px;
    color: #303133;
    line-height: 20px;
    text-align: left;
    font-style: normal;
  }

  .content-view{
    flex: 1;
    background: rgba(229,236,245,0.5);
    border-radius: 6px;
    padding: 10px;
  }

  .table-content{
    flex: 1;
    padding: 12px 16px;
    background: #fff;
    border-radius: 6px;
  }  
`

export default function DeviceSettingModal({
  open,
  onClose = null,
  projectId,
  areaId,
  areaName,
  deviceStyles,
}) {
  const [form] = Form.useForm()
  const [deviceSummary, setDeviceSummary] = useState([])
  const [deviceSub, setDeviceSub] = useState([])
  const [unselected, setUnselected] = useState([])
  const [deviceType, setDeviceType] = useState(0)
  const [selectedSummaryKeys, setSelectedSummaryKeys] = useState([])
  const [selectedSubKeys, setSelectedSubKeys] = useState([])
  const [selectedUnselectedKeys, setSelectedUnselectedKeys] = useState([])
  const { laptop } = useSelector(adaptation) || {}
  const devicesRef = React.useRef({
    unselected: [],
    deviceSummary: [],
    deviceSub: [],
  });

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

  const refreshDevices = async () => {
    if (!areaId) return;
    await getUnselectedDevices({ areaId });
    await getSelectedDevices({ areaId });
  };

  React.useEffect(() => {
    if (open && areaId) {
      refreshDevices();
    }
  }, [open, areaId]);

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

  const handleDeviceTypeChange = (value) => {
    setDeviceType(value);
    getUnselectedDevices({ areaId, type: value });
    getSelectedDevices({ areaId, type: value });
  };

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

  const summaryRowSelection = {
    selectedRowKeys: selectedSummaryKeys,
    onChange: (keys) => {
      setSelectedSummaryKeys(keys);
    },
  };

  const subRowSelection = {
    selectedRowKeys: selectedSubKeys,
    onChange: (keys) => {
      setSelectedSubKeys(keys);
    },
  };

  const unselectedRowSelection = {
    selectedRowKeys: selectedUnselectedKeys,
    onChange: (keys) => {
      setSelectedUnselectedKeys(keys);
    },
  };

  const handleClose = () => {
    onClose()
    form.resetFields()
    setSelectedSummaryKeys([])
    setSelectedSubKeys([])
    setSelectedUnselectedKeys([])
  };

  return (
    <CModal
      width={laptop ? 1200 : 1400}
      onCancel={handleClose}
      open={open}
      closable={false}
      destroyOnHidden
      mold="cust"
      title={`添加设备(${areaName})`}
      footer={<CustButtonT text="Cancel" onClick={handleClose} style={{ marginLeft: 'auto' }} />}
    >
      <Flex align='center' gap={16} style={{ height: laptop ? 600 : 800 }}>
        <LeftContentView gap={12} vertical>
          <div className='title'>未选中的设备({unselected.length})</div>
          <Flex vertical gap={12} className='table-content'>
            <Form form={form} layout="inline" style={{ gap: 12 }}>
              <Form.Item label="设备类型" name="type" initialValue={0}>
                <Select
                  style={{ width: 120 }}
                  onChange={handleDeviceTypeChange}
                  defaultValue={deviceType}
                  fieldNames={{ label: 'name', value: 'deviceStyle' }}
                  options={[{ deviceStyle: 0, name: '全部类型' }, ...deviceStyles]}
                />
              </Form.Item>
              <Form.Item name="alike" label="设备搜索">
                <Input.Search
                  allowClear
                  placeholder="输入设备编号/安装地址"
                  onSearch={(value) => getUnselectedDevices({ areaId, alike: value })}
                  style={{ width: 230 }}
                />
              </Form.Item>
            </Form>
            <UserTable
              columns={getDeviceSettingColumns()}
              rowSelection={unselectedRowSelection}
              dataSource={unselected}
              rowKey="id"
              scroll={{
                x: 'max-content',
                y: laptop ? 440 : 640
              }}
            />
          </Flex>
        </LeftContentView>
        <Flex
          vertical
          justify='space-evenly'
          align='center'
          gap={24}
          style={{ height: '100%' }}
        >
          <Flex vertical gap={12}>
            <CustButton
              wh='auto'
              onClick={() => handleMove(1)}
            >{'添加总表 >'}</CustButton>
            <CustButton
              wh='auto'
              onClick={() => handleMove(2)}
            >{'< 撤销'}</CustButton>
          </Flex>
          <Flex vertical gap={12}>
            <CustButton
              wh='auto'
              onClick={() => handleMove(3)}
            >{'添加分表 >'}</CustButton>
            <CustButton
              wh='auto'
              onClick={() => handleMove(4)}
            >{'< 撤销'}</CustButton>
          </Flex>
        </Flex>
        <RightContentView gap={12} vertical>
          <Flex className='content-view' vertical gap={12}>
            <div className='title'>总表({deviceSummary.length})</div>
            <Flex
              vertical
              gap={12}
              className='table-content'
            >
              <Flex align='center' justify='space-between'>
                <Input.Search
                  allowClear
                  onPressEnter={(e) => handleSearch(e.target.value, 0)}
                  placeholder="输入设备编号/设备名称"
                  onSearch={(value) => handleSearch(value, 0)}
                  style={{ width: 230 }}
                />
                <CustButtonT text="save" onClick={() => handleSaveOrder(0)} />
              </Flex>
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
                    y: laptop ? 142 : 242
                  }}
                />
              </DndProvider>
            </Flex>
          </Flex>
          <Flex className='content-view' vertical gap={12}>
            <div className='title'>分表({deviceSub.length})</div>
            <Flex
              vertical
              gap={12}
              className='table-content'
              style={{ height: laptop ? 242 : 342 }}
            >
              <Flex align='center' justify='space-between'>
                <Input.Search
                  allowClear
                  onPressEnter={(e) => handleSearch(e.target.value, 1)}
                  placeholder="输入设备编号/设备名称"
                  onSearch={(value) => handleSearch(value, 1)}
                  style={{ width: 230 }}
                />
                <CustButtonT text="save" onClick={() => handleSaveOrder(1)} />
              </Flex>
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
                    y: laptop ? 142 : 242
                  }}
                />
              </DndProvider>
            </Flex>
          </Flex>
        </RightContentView>
      </Flex>
    </CModal>
  );
}