import PageContent from '@com/pagecontent';
import UseTree from '@com/useTree';
import { Empty, Flex, Typography } from 'antd';
import React, { useState, useRef } from 'react';
import { useQueryAreaDeviceNum } from './api.js';
import { useRequest } from 'ahooks';
import { useSelector } from 'react-redux';
import { filterDeviceStyle, selectProjectId } from '@redux/systemconfig';
import { head, isArray } from 'lodash';
import { getTabLabelByType } from './Constant.js';
import CustContext from '@com/content.js';
import styled from 'styled-components';
import { CustButton } from "@com/useButton";
import DeviceMainView from './components/DeviceMainView.js';
import { useSearchParams } from 'react-router-dom';
import { ReactComponent as HelpIcon } from './icon/help.svg'
import DeviceSettingDrawer from './components/DeviceSettingDrawer.js';
import emptyImg from '@svgs/empty.svg'
import CustomTreeView from './components/CustomTreeView.js';
import DeviceShareDrawer from './components/DeviceShareDrawer.js';

const Header = styled(Flex)`
  padding: 10px 16px;
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
`

export default function Index() {
  const [treeId, setTreeId] = useState('');
  const [treeName, setTreeName] = useState('');
  const deviceStyles = useSelector(filterDeviceStyle);
  const projectId = useSelector(selectProjectId);
  // 获取URL搜索参数
  let [searchParams] = useSearchParams()
  // 从URL参数中获取item值，用于确定默认选中的页签
  const itemParam = searchParams.get('item')
  // 默认选中的页签值，如果URL中有item参数则使用该参数，否则默认为'1'
  const initialTabValue = itemParam !== null ? itemParam.toString() : '1'
  //设备页签
  const [tabs, setTabs] = useState([])
  const [deviceType, setDeviceType] = useState(initialTabValue)
  const tabPropsData = {
    tabs,
    deviceType,
    projectId,
    areaId: treeId,
    setvalue: setDeviceType
  }
  // 设备配置弹窗
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 设备分摊弹窗
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);

  /**
   * 获取区域下的设备数量
   */
  const { run: runQueryAreaDeviceNum } = useRequest(() => {
    // 初始化页签为空数组
    setTabs([])
    return useQueryAreaDeviceNum({ projectId, areaId: treeId });
  }, {
    refreshDeps: [treeId],
    ready: treeId,
    onSuccess: ({ data }) => {
      data && isArray(data) && setTabs(data?.sort((a, b) => a.type - b.type).map(item => ({ label: `${getTabLabelByType(item.type)}(${item.count})`, key: item.type.toString() })) || [])
    }
  });

  /**
   * 添加设备
   */
  const onAddDeviceClick = () => {
    if (!treeId) {
      return
    }
    // 打开添加设备弹窗
    setDrawerOpen(true);
  }

  /**
   * 操作视频点击事件
   */
  const onHelpVideoClick = () => {
    // 打开操作视频视频弹窗
  }

  /**
   * 设备分摊点击事件
   */
  const onDeviceShareClick = () => {
    // 打开设备分摊弹窗
    setShareDrawerOpen(true);
  }

  /**
   * 去执行点击事件
   */
  const onExecuteClick = () => {
    // 打开去执行弹窗
  }

  return (
    <PageContent bgcolor="transparent" pd="0">
      <Flex gap={12} style={{ minHeight: '100%' }}>
        <Flex style={{ width: 265 }}>
          <CustomTreeView
            onAreaSelect={(node) => {
              setTreeId(node.key)
              setTreeName(node.title)
            }}
          />
        </Flex>
        <Flex flex={1} gap={12} vertical>
          <Header justify='space-between' align='center'>
            <CustButton wh='auto' src='new' onClick={onAddDeviceClick}>添加设备</CustButton>
            <Flex align='center' gap={12}>
              <HelpIcon onClick={onHelpVideoClick} style={{ cursor: 'pointer' }} />
              <CustButton onClick={onDeviceShareClick}>设备分摊</CustButton>
              <Typography.Link onClick={onExecuteClick}>去执行</Typography.Link>
            </Flex>
          </Header>
          <CustContext.Provider value={tabPropsData}>
            <PageContent>
              {
                tabs.length > 0 ? <DeviceMainView /> :
                  <Empty
                    image={emptyImg}
                    description={'暂无数据' ?? i18t("comm", "NoDataAvailable")}
                  />
              }
            </PageContent>
          </CustContext.Provider>
        </Flex>
      </Flex>
      <DeviceSettingDrawer
        open={drawerOpen}
        onClose={() => {
          // 关闭弹窗时，刷新设备数量
          runQueryAreaDeviceNum()
          setDrawerOpen(false)
        }}
        projectId={projectId}
        areaId={treeId}
        areaName={treeName}
        deviceStyles={deviceStyles}
      />
      <DeviceShareDrawer
        open={shareDrawerOpen}
        onClose={() => {
          setShareDrawerOpen(false)
        }}
        projectId={projectId}
        deviceStyles={deviceStyles}
      />
    </PageContent>
  );
}