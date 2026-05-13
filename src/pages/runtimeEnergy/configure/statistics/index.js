import PageContent from '@com/pagecontent';
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { filterDeviceStyle, selectProjectId } from '@redux/systemconfig';
import DeviceSettingModal from './components/DeviceSettingModal.js';
import CustomTreeView from './components/CustomTreeView.js';
import DeviceShareModal from './components/DeviceShareModal.js';
import AreaDeviceMain from './components/AreaDeviceMain.js';
import { Flex } from 'antd';

export default function Index() {
  // 区域树
  const treeRef = useRef(null)
  // 设备主视图ref
  const deviceMainRef = useRef(null)
  // 选中的区域ID
  const [treeId, setTreeId] = useState('')
  // 选中的区域名称
  const [treeName, setTreeName] = useState('')
  // 设备样式
  const deviceStyles = useSelector(filterDeviceStyle)
  // 项目ID
  const projectId = useSelector(selectProjectId)
  // 设备配置弹窗
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 设备分摊弹窗
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);

  return (
    <PageContent bgcolor="transparent" pd="0">
      <Flex gap={12} style={{ minHeight: '100%' }}>
        <Flex style={{ width: 265 }}>
          <CustomTreeView
            ref={treeRef}
            onAreaSelect={(node) => {
              // 设置选中区域ID
              setTreeId(node.key)
              setTreeName(node.title)
              // 刷新设备数量
              deviceMainRef.current?.refreshDeviceNum()
            }}
          />
        </Flex>
        <Flex flex={1} gap={12} vertical>
          <AreaDeviceMain
            ref={deviceMainRef}
            projectId={projectId}
            treeId={treeId}
            setDrawerOpen={setDrawerOpen}
            setShareDrawerOpen={setShareDrawerOpen}
          />
        </Flex>
      </Flex>
      <DeviceSettingModal
        open={drawerOpen}
        onClose={() => {
          // 关闭弹窗时，刷新设备数量
          deviceMainRef.current?.refreshDeviceNum()
          // 刷新树节点数据
          treeRef.current?.refreshTreeData()
          setDrawerOpen(false)
        }}
        projectId={projectId}
        areaId={treeId}
        areaName={treeName}
        deviceStyles={deviceStyles}
      />
      <DeviceShareModal
        open={shareDrawerOpen}
        onClose={() => {
          setShareDrawerOpen(false)
        }}
        projectId={projectId}
        areaId={treeId}
        areaName={treeName}
        deviceStyles={deviceStyles}
      />
    </PageContent>
  );
}