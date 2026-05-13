import CustContext from "@com/content"
import { Flex, Input } from "antd"
import { useContext, useEffect, useMemo, useState } from "react"
import ProTable from '@com/useTable/proTable'
import { SearchOutlined } from "@ant-design/icons"
import { getTableColumnsByType } from "../Constant"
import styled from "styled-components"
import { useQueryUsedMeter } from "../api"
import { useRequest } from 'ahooks'

const TableContent = styled(Flex)`
    flex: 1;
    height: 100%;
`

export default function DeviceMainView() {
    // 从上下文获取设备类型、项目ID、区域ID
    const { deviceType, projectId, areaId } = useContext(CustContext) || {}
    // 设备表格列
    const [columns, setColumns] = useState([])
    // 设备表格数据
    const [allData, setAllData] = useState({ deviceSummary: [], deviceSub: [] })
    // 左侧表格搜索值
    const [leftAlike, setLeftAlike] = useState('')
    // 右侧表格搜索值
    const [rightAlike, setRightAlike] = useState('')

    useEffect(() => {
        // 设备类型改变时，刷新表格列
        setColumns(getTableColumnsByType(deviceType))
        // 设备类型改变时，刷新搜索值
        setLeftAlike('')
        // 设备类型改变时，刷新右侧表格搜索值
        setRightAlike('')
    }, [deviceType])

    useEffect(() => {
        // 区域ID改变时，刷新设备数量
        console.log('发生变化------------------->', areaId, deviceType, projectId)
    }, [deviceType, projectId, areaId])

    /**
     * 查询设备数据
     */
    useRequest(() => useQueryUsedMeter({ projectId, areaId, type: deviceType }), {
        refreshDeps: [projectId, areaId, deviceType],
        ready: areaId && deviceType,
        onSuccess: ({ data }) => {
            setAllData({
                deviceSummary: data?.deviceSummary || [],
                deviceSub: data?.deviceSub || [],
            })
        }
    })

    /**
     * 过滤设备数据
     */
    const filterData = (data, alike) => {
        if (!alike.trim()) return data
        return data.filter(item => {
            const searchLower = alike.toLowerCase()
            return (
                (item.sn && item.sn.toLowerCase().includes(searchLower)) ||
                (item.address && item.address.toLowerCase().includes(searchLower)) ||
                (item.name && item.name.toLowerCase().includes(searchLower))
            )
        })
    }

    /**
     * 左侧表格数据
     */
    const leftTableData = useMemo(() => {
        return filterData(allData.deviceSummary, leftAlike)
    }, [allData.deviceSummary, leftAlike])

    /**
     * 右侧表格数据
     */
    const rightTableData = useMemo(() => {
        return filterData(allData.deviceSub, rightAlike)
    }, [allData.deviceSub, rightAlike])

    return (
        <Flex align="center" gap={16} style={{ minHeight: 200, flex: 1 }}>
            <TableContent>
                <ProTable
                    key={`left-table-${deviceType}`}
                    headerTitle={`总表详情(${allData.deviceSummary.length})`}
                    search={false}
                    bordered={true}
                    pagination={false}
                    toolBarRender={() => (
                        <Input
                            allowClear
                            placeholder="请输入设备编号/安装地址"
                            value={leftAlike}
                            onChange={(e) => setLeftAlike(e.target.value)}
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                        />
                    )}
                    options={false}
                    rowKey="id"
                    columns={columns}
                    dataSource={leftTableData}
                    scroll={{
                        x: 'max-content',
                        y: 'calc(100vh - 320px)'
                    }}
                />
            </TableContent>
            <TableContent>
                <ProTable
                    key={`right-table-${deviceType}`}
                    headerTitle={`分表详情(${allData.deviceSub.length})`}
                    search={false}
                    options={false}
                    bordered={true}
                    pagination={false}
                    toolBarRender={() => (
                        <Input
                            allowClear
                            placeholder="请输入设备编号/安装地址"
                            value={rightAlike}
                            onChange={(e) => setRightAlike(e.target.value)}
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                        />
                    )}
                    rowKey="id"
                    columns={columns}
                    dataSource={rightTableData}
                    scroll={{
                        x: 'max-content',
                        y: 'calc(100vh - 320px)'
                    }}
                />
            </TableContent>
        </Flex>
    )
}
