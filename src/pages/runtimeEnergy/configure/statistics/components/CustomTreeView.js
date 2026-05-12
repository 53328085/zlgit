import { energyShare } from "@api/api";
import TitleLayout from "@com/titlelayout";
import { useGetXY } from "@com/usehandler";
import { selectProjectId } from "@redux/systemconfig";
import { useRequest } from "ahooks";
import { Flex, Input, Tree } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

export const TreeContainer = styled(Flex)`
  && {
    overflow: hidden;
    flex: 1;
    scrollbar-width: thin;
    color: #303133;
    
    .ant-tree-title {
       color: #303133;
    }  
`;

export default function CustomTreeView({ onAreaSelect }) {
    // 项目id
    const projectId = useSelector(selectProjectId)
    // 搜索框输入值
    const [searchValue, setSearchValue] = useState('')
    // 树展开的节点
    const [expandedKeys, setExpandedKeys] = useState([])
    // 选中的节点
    const [selectedKeys, setSelectedKeys] = useState([])
    // 树高度
    const { scrollY } = useGetXY({ selector: ".ant-tree-list", extraHeight: 16 })
    // 树数据
    const [treeData, setTreeData] = useState([])

    /**
     * 搜索框输入事件
     */
    const onSearchChange = (e) => {
        setSearchValue(e.target.value)
    }

    /**
     * 递归转换树数据结构并收集所有节点key
     * 将接口返回的数据转换为Tree组件可识别的结构，同时收集所有节点key用于默认展开
     */
    const transformTreeData = (data) => {
        let keys = []
        const transform = (items) => {
            return items.map(item => {
                const transformed = {
                    key: item.areaId,
                    title: item.name,
                    // 保留原始数据用于回调返回
                    original: item,
                }
                keys.push(item.areaId)
                if (item.nodes && item.nodes.length > 0) {
                    transformed.children = transform(item.nodes)
                }
                return transformed
            })
        }
        const treeData = transform(data)
        return { treeData, keys }
    }

    /**
     * 根据key查找节点信息
     */
    const findNodeByKey = (treeData, key) => {
        for (const node of treeData) {
            if (node.key === key) {
                return node
            }
            if (node.children && node.children.length > 0) {
                const found = findNodeByKey(node.children, key)
                if (found) return found
            }
        }
        return null
    }

    /**
     * 树节点展开/收起事件
     */
    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue)
    }

    /**
     * 单选模式 - 禁止取消选中，至少选中一项
     */
    const onSelect = (newSelectedKeys, info) => {
        // 如果点击的是已选中的节点，不取消选中（保持至少选中一项）
        if (newSelectedKeys.length === 0 && selectedKeys.length > 0) {
            return
        }
        // 更新选中状态
        setSelectedKeys(newSelectedKeys)

        // 如果有选中项且有回调函数，传递整个节点信息
        if (newSelectedKeys.length > 0 && onAreaSelect) {
            const selectedNode = findNodeByKey(treeData, newSelectedKeys[0])
            if (selectedNode) {
                onAreaSelect(selectedNode)
            }
        }
    }

    /**
     * 获取区域树数据
     * 包含区域名称搜索
     * 默认展开所有节点
     * 默认选中第一项
     */
    const { run: getTreeData } = useRequest(
        () => energyShare.QuerySpaceTrees({
            projectId,
            areaId: 0,
            areaName: searchValue,
        }), {
        refreshDeps: [],
        onSuccess: ({ data }) => {
            const { treeData, keys } = transformTreeData(data)
            setTreeData(treeData)
            // 默认展开所有节点
            setExpandedKeys(keys)

            // 默认选中第一项
            if (keys.length > 0) {
                const firstKey = keys[0]
                setSelectedKeys([firstKey])
                // 触发选中回调
                if (onAreaSelect) {
                    const firstNode = findNodeByKey(treeData, firstKey)
                    if (firstNode) {
                        onAreaSelect(firstNode)
                    }
                }
            }
        }
    })

    return (
        <TitleLayout title='选择区域'>
            <TreeContainer gap={16} vertical>
                <Input.Search
                    placeholder='请输入关键字查询'
                    allowClear
                    value={searchValue}
                    onChange={onSearchChange}
                    onSearch={getTreeData}
                />
                <Tree
                    treeData={treeData}
                    expandedKeys={expandedKeys}
                    selectedKeys={selectedKeys}
                    onSelect={onSelect}
                    onExpand={onExpand}
                    height={scrollY}
                />
            </TreeContainer>
        </TitleLayout>
    )
}