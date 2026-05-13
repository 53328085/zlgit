import TitleLayout from "@com/titlelayout";
import { Empty, Flex, Radio } from "antd";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as HelpIcon } from "../icon/help.svg";
import emptyImg from '@svgs/empty.svg'
import DeviceMainView from "./DeviceMainView";
import { CustButton } from "@com/useButton";
import CustContext from '@com/content.js';
import { useRequest } from "ahooks";
import { useQueryAreaDeviceNum } from "../api";
import { getTabLabelByType } from "../Constant";
import { head, isArray } from "lodash";

const VideoText = styled.div`
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #303133;
    line-height: 20px;
    text-align: left;
    font-style: normal;
`

const AreaDeviceMain = forwardRef(({
    projectId,
    treeId,
    setDrawerOpen,
    setShareDrawerOpen,
}, ref) => {
    // 获取URL搜索参数
    let [searchParams] = useSearchParams()
    // 从URL参数中获取item值，用于确定默认选中的页签
    const itemParam = searchParams.get('item')
    // 默认选中的页签值，如果URL中有item参数则使用该参数，否则默认为'1'
    const initialTabValue = itemParam !== null ? itemParam.toString() : '1'
    //设备页签
    const [tabs, setTabs] = useState([])
    // 选中的设备类型
    const [deviceType, setDeviceType] = useState(initialTabValue)
    // 页签属性数据
    const tabPropsData = {
        deviceType,
        projectId,
        areaId: treeId,
    }

    /**
     * 获取区域下的设备数量
     */
    const { run: runQueryAreaDeviceNum } = useRequest(
        () => useQueryAreaDeviceNum({ projectId, areaId: treeId })
        , {
            refreshDeps: [],
            ready: treeId,
            onSuccess: ({ data }) => {
                if (data && isArray(data)) {
                    setTabs(data?.sort((a, b) => a.type - b.type).map(item => ({ label: `${getTabLabelByType(item.type)}(${item.count})`, value: item.type.toString() })) || [])
                    setDeviceType(head(data)?.type.toString() || '')
                }
            }
        });

    // 暴露对外接口
    useImperativeHandle(ref, () => ({
        // 刷新设备数量
        refreshDeviceNum: () => {
            // 初始化页签为空数组
            setTabs([])
            setDeviceType('')
            runQueryAreaDeviceNum()
        }
    }));

    /**
     * 添加设备
     */
    const onAddDeviceClick = () => {
        // 打开添加设备弹窗
        setDrawerOpen(true)
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
        setShareDrawerOpen(true)
    }

    /**
     * 去执行点击事件
     */
    const onExecuteClick = () => {
        // 打开去执行弹窗
    }

    return (
        <TitleLayout
            title={
                <Flex align="center" justify="space-between">
                    <div>配置设备</div>
                    <Flex align="center" gap={12}>
                        <Flex
                            align="center"
                            gap={8}
                            style={{ cursor: 'pointer' }}
                            onClick={onHelpVideoClick}
                        >
                            <HelpIcon />
                            <VideoText>说明</VideoText>
                        </Flex>
                        <CustButton
                            style={{
                                backgroundColor: '#fff',
                                borderColor: '#46C7FF',
                                color: '#46C7FF'
                            }}
                            onClick={onExecuteClick}
                        >去执行</CustButton>
                        <CustButton
                            style={{
                                backgroundColor: '#46C7FF',
                                borderColor: '#46C7FF',
                                color: '#fff'
                            }}
                            onClick={onDeviceShareClick}
                        >设备分摊</CustButton>
                        <CustButton onClick={onAddDeviceClick}>添加设备</CustButton>
                    </Flex>
                </Flex>
            }
            layout="flex"
            dr="column"
        >
            <CustContext.Provider value={tabPropsData}>
                <Flex vertical gap={14} style={{ height: '100%' }}>
                    <Radio.Group
                        options={tabs}
                        onChange={(e) => setDeviceType(e.target.value)}
                        value={deviceType}
                        optionType="button"
                        buttonStyle="solid"
                    />
                    {
                        tabs.length > 0 ?
                            <DeviceMainView /> :
                            <Empty
                                image={emptyImg}
                                description={'暂无数据' ?? i18t("comm", "NoDataAvailable")}
                            />
                    }
                </Flex>
            </CustContext.Provider>
        </TitleLayout>
    )
})

export default AreaDeviceMain;