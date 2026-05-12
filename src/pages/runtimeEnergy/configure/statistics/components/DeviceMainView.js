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
    border: 1px solid #e8e8e8;
    padding: 12px;
`

export default function DeviceMainView() {
    const { deviceType, projectId, areaId } = useContext(CustContext) || {}
    const [columns, setColumns] = useState([])
    const [allData, setAllData] = useState({ deviceSummary: [], deviceSub: [] })
    const [leftAlike, setLeftAlike] = useState('')
    const [rightAlike, setRightAlike] = useState('')

    useEffect(() => {
        setColumns(getTableColumnsByType(deviceType))
        setLeftAlike('')
        setRightAlike('')
    }, [deviceType])

    useRequest(() => useQueryUsedMeter({ projectId, areaId, type: deviceType }), {
        refreshDeps: [projectId, areaId, deviceType],
        ready: !!areaId,
        onSuccess: ({ data }) => {
            setAllData({
                deviceSummary: data?.deviceSummary || [],
                deviceSub: data?.deviceSub || [],
            })
        }
    })

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

    const leftTableData = useMemo(() => {
        return filterData(allData.deviceSummary, leftAlike)
    }, [allData.deviceSummary, leftAlike])

    const rightTableData = useMemo(() => {
        return filterData(allData.deviceSub, rightAlike)
    }, [allData.deviceSub, rightAlike])

    return (
        <Flex align="center" gap={16} style={{ minHeight: 200, flex: 1 }}>
            <TableContent>
                <ProTable
                    key={`left-table-${deviceType}`}
                    headerTitle="总表详情"
                    search={false}
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
                        y: 'calc(100vh - 400px)'
                    }}
                />
            </TableContent>
            <TableContent>
                <ProTable
                    key={`right-table-${deviceType}`}
                    headerTitle="分表详情"
                    search={false}
                    options={false}
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
                        y: 'calc(100vh - 400px)'
                    }}
                />
            </TableContent>
        </Flex>
    )
}
