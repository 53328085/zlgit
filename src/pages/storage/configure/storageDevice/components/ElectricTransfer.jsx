import React, { useEffect, useState } from 'react'
import { Table, Input, message, Button, Space } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { cloneDeep } from 'lodash'

export default function ElectricTransfer (props) {
  const [messageApi, contextHolder] = message.useMessage()
  const { Search } = Input
  const columns = props.columns || [
    {
      title: '设备编号',
      dataIndex: 'sn',
      align: 'center',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      align: 'center',
    },
    {
      title: '设备类型',
      dataIndex: 'category',
      align: 'center',
    },
    {
      title: '安装地址',
      dataIndex: 'address',
      align: 'center',
    }
  ]
  const [mainData, setMainData] = useState([])
  const [mainTargetKeys, setMainTargetKeys] = useState([])
  const [loadData, setLoadData] = useState([])
  const [loadTargetKeys, setLoadTargetKeys] = useState([])
  const [gridData, setGridData] = useState([])
  const [gridTargetKeys, setGridTargetKeys] = useState([])
  const [unknownData, setUnknownData] = useState([])
  const [unknownCopy, setUnknownCopy] = useState([])
  const [searchValue, setSearchValue] = useState('')

  // 用于追踪穿梭框的选中状态
  const [mainSelectedKeys, setMainSelectedKeys] = useState([])
  const [loadSelectedKeys, setLoadSelectedKeys] = useState([])
  const [gridSelectedKeys, setGridSelectedKeys] = useState([])
  const [unknownSelectedKeys, setUnknownSelectedKeys] = useState([])

  useEffect(() => {
    // 使用传入的数据或者默认的mock数据
    let mainArr = props.mainTable ? cloneDeep(props.mainTable) : []
    let loadArr = props.loadTable ? cloneDeep(props.loadTable) : []
    let gridArr = props.gridTable ? cloneDeep(props.gridTable) : []
    let unknownArr = props.unknownTable ? cloneDeep(props.unknownTable) : []

    // 确保数据有key字段
    mainArr = mainArr.map(item => ({ ...item, key: item.key || item.sn }))
    loadArr = loadArr.map(item => ({ ...item, key: item.key || item.sn }))
    gridArr = gridArr.map(item => ({ ...item, key: item.key || item.sn }))
    unknownArr = unknownArr.map(item => ({ ...item, key: item.key || item.sn }))

    setMainData(mainArr)
    setMainTargetKeys(mainArr.map(item => item.key))
    setLoadData(loadArr)
    setLoadTargetKeys(loadArr.map(item => item.key))
    setGridData(gridArr)
    setGridTargetKeys(gridArr.map(item => item.key))
    setUnknownData(unknownArr)
    setUnknownCopy(unknownArr)
  }, [props.mainTable, props.loadTable, props.gridTable, props.unknownTable])

  // 未知设备 -> 主表
  const unknownToMain = () => {
    if (mainData.length >= 1) {
      messageApi.open({
        type: 'warning',
        content: '当前线路已有总表！',
      })
    } else if (unknownSelectedKeys.length === 0) {
      messageApi.open({
        type: 'warning',
        content: '请至少选择一个设备！',
      })
    } else if (unknownSelectedKeys.length > 1) {
      messageApi.open({
        type: 'warning',
        content: '线路总表只能有一个设备！',
      })
    } else {
      // 移动到主表
      const movedItems = unknownData.filter(item => unknownSelectedKeys.includes(item.key))
      setMainData(movedItems)
      setMainTargetKeys(movedItems.map(item => item.key))
      setUnknownData(unknownData.filter(item => !unknownSelectedKeys.includes(item.key)))
      setUnknownSelectedKeys([])

      // 调用回调函数通知父组件数据变化
      props.saveValue && props.saveValue({
        mainData: movedItems,
        loadData: loadData,
        gridData: gridData,
        unknownData: unknownData.filter(item => !unknownSelectedKeys.includes(item.key))
      })
    }
  }

  // 未知设备 -> 负载表
  const unknownToLoad = () => {
    if (unknownSelectedKeys.length === 0) {
      messageApi.open({
        type: 'warning',
        content: '请至少选择一个设备！',
      })
    } else {
      // 移动到负载表（增量添加）
      const movedItems = unknownData.filter(item => unknownSelectedKeys.includes(item.key))
      setLoadData([...loadData, ...movedItems])
      setLoadTargetKeys([...loadTargetKeys, ...movedItems.map(item => item.key)])
      setUnknownData(unknownData.filter(item => !unknownSelectedKeys.includes(item.key)))
      setUnknownSelectedKeys([])

      // 调用回调函数通知父组件数据变化
      props.saveValue && props.saveValue({
        mainData: mainData,
        loadData: [...loadData, ...movedItems],
        gridData: gridData,
        unknownData: unknownData.filter(item => !unknownSelectedKeys.includes(item.key))
      })
    }
  }

  // 未知设备 -> 并网表
  const unknownToGrid = () => {
    if (gridData.length >= 1) {
      messageApi.open({
        type: 'warning',
        content: '当前线路已有并网总表！',
      })
    } else if (unknownSelectedKeys.length === 0) {
      messageApi.open({
        type: 'warning',
        content: '请至少选择一个设备！',
      })
    } else if (unknownSelectedKeys.length > 1) {
      messageApi.open({
        type: 'warning',
        content: '并网总表只能有一个设备！',
      })
    } else {
      // 移动到并网表
      const movedItems = unknownData.filter(item => unknownSelectedKeys.includes(item.key))
      setGridData(movedItems)
      setGridTargetKeys(movedItems.map(item => item.key))
      setUnknownData(unknownData.filter(item => !unknownSelectedKeys.includes(item.key)))
      setUnknownSelectedKeys([])

      // 调用回调函数通知父组件数据变化
      props.saveValue && props.saveValue({
        mainData: mainData,
        loadData: loadData,
        gridData: movedItems,
        unknownData: unknownData.filter(item => !unknownSelectedKeys.includes(item.key))
      })
    }
  }

  // 主表 -> 未知设备
  const mainToUnknown = () => {
    if (mainSelectedKeys.length === 0) {
      messageApi.open({
        type: 'warning',
        content: '请先选择设备！',
      })
    } else {
      const movedItems = mainData.filter(item => mainSelectedKeys.includes(item.key))
      setUnknownData([...unknownData, ...movedItems])
      setMainData(mainData.filter(item => !mainSelectedKeys.includes(item.key)))
      setMainTargetKeys(mainData.filter(item => !mainSelectedKeys.includes(item.key)).map(item => item.key))
      setMainSelectedKeys([])

      // 调用回调函数通知父组件数据变化
      props.saveValue && props.saveValue({
        mainData: mainData.filter(item => !mainSelectedKeys.includes(item.key)),
        loadData: loadData,
        gridData: gridData,
        unknownData: [...unknownData, ...movedItems]
      })
    }
  }

  // 负载表 -> 未知设备
  const loadToUnknown = () => {
    if (loadSelectedKeys.length === 0) {
      messageApi.open({
        type: 'warning',
        content: '请先选择设备！',
      })
    } else {
      const movedItems = loadData.filter(item => loadSelectedKeys.includes(item.key))
      setUnknownData([...unknownData, ...movedItems])
      setLoadData(loadData.filter(item => !loadSelectedKeys.includes(item.key)))
      setLoadTargetKeys(loadData.filter(item => !loadSelectedKeys.includes(item.key)).map(item => item.key))
      setLoadSelectedKeys([])

      // 调用回调函数通知父组件数据变化
      props.saveValue && props.saveValue({
        mainData: mainData,
        loadData: loadData.filter(item => !loadSelectedKeys.includes(item.key)),
        gridData: gridData,
        unknownData: [...unknownData, ...movedItems]
      })
    }
  }

  // 并网表 -> 未知设备
  const gridToUnknown = () => {
    if (gridSelectedKeys.length === 0) {
      messageApi.open({
        type: 'warning',
        content: '请先选择设备！',
      })
    } else {
      const movedItems = gridData.filter(item => gridSelectedKeys.includes(item.key))
      setUnknownData([...unknownData, ...movedItems])
      setGridData(gridData.filter(item => !gridSelectedKeys.includes(item.key)))
      setGridTargetKeys(gridData.filter(item => !gridSelectedKeys.includes(item.key)).map(item => item.key))
      setGridSelectedKeys([])

      // 调用回调函数通知父组件数据变化
      props.saveValue && props.saveValue({
        mainData: mainData,
        loadData: loadData,
        gridData: gridData.filter(item => !gridSelectedKeys.includes(item.key)),
        unknownData: [...unknownData, ...movedItems]
      })
    }
  }

  // 搜索处理
  const handleSearch = (value) => {
    setSearchValue(value)
    if (value === '') {
      setUnknownData([...unknownCopy])
    } else {
      const filtered = unknownCopy.filter(item =>
        (item.sn && item.sn.includes(value)) ||
        (item.deviceName && item.deviceName.includes(value)) ||
        (item.address && item.address.includes(value))
      )
      setUnknownData(filtered)
    }
  }

  // 定义多个穿梭框，分别对应不同的目标表
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {contextHolder}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'start' }}>

        {/* 左侧：未知设备列表 */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div
            style={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
            {props.transferTitle?.unknownTitle || '未分配设备'}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Search
              placeholder="请输入设备编号/安装地址"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              enterButton
            />
          </div>
          <Table
            rowSelection={{
              selectedRowKeys: unknownSelectedKeys,
              onChange: (selectedRowKeys) => {
                setUnknownSelectedKeys(selectedRowKeys)
              },
            }}
            columns={columns}
            dataSource={unknownData}
            size="small"
            pagination={false}
            scroll={{ y: 460 }}
            onRow={(record) => ({
              onClick: (event) => {
                // 避免点击行触发选择框
                if (!event.target.closest('input[type="checkbox"]')) {
                  const isSelected = unknownSelectedKeys.includes(record.key)
                  const newSelectedKeys = isSelected
                    ? unknownSelectedKeys.filter(key => key !== record.key)
                    : [...unknownSelectedKeys, record.key]
                  setUnknownSelectedKeys(newSelectedKeys)
                }
              },
            })}
          />
        </div>

        {/* 操作按钮列 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          height: '100%'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '160px'
          }}>
            <Space direction="vertical" size="middle">
              <Space direction="vertical">
                <Button icon={<LeftOutlined/>} onClick={gridToUnknown}/>
                <Button icon={<RightOutlined/>} onClick={unknownToGrid}/>
              </Space>
            </Space>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px'
          }}>
            <Space direction="vertical" size="middle">
              <Space direction="vertical">
                <Button icon={<LeftOutlined/>} onClick={mainToUnknown}/>
                <Button icon={<RightOutlined/>} onClick={unknownToMain}/>
              </Space>
            </Space>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
          }}>
            <Space direction="vertical" size="middle">
              <Space direction="vertical">
                <Button icon={<LeftOutlined/>} onClick={loadToUnknown}/>
                <Button icon={<RightOutlined/>} onClick={unknownToLoad}/>
              </Space>
            </Space>
          </div>
        </div>

        {/* 右侧：主表、负载表、并网表 - 显示已选中的设备 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 并网表 */}
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Table
              title={() => props.transferTitle?.gridTitle || '并网关口表'}
              rowSelection={{
                selectedRowKeys: gridSelectedKeys,
                onChange: (selectedRowKeys) => {
                  setGridSelectedKeys(selectedRowKeys)
                },
              }}
              columns={columns}
              dataSource={gridData}
              size="small"
              pagination={false}
              scroll={{
                y: 40
              }}
              onRow={(record) => ({
                onClick: (event) => {
                  // 避免点击行触发选择框
                  if (!event.target.closest('input[type="checkbox"]')) {
                    const isSelected = gridSelectedKeys.includes(record.key)
                    const newSelectedKeys = isSelected
                      ? gridSelectedKeys.filter(key => key !== record.key)
                      : [...gridSelectedKeys, record.key]
                    setGridSelectedKeys(newSelectedKeys)
                  }
                },
              })}
            />
          </div>

          {/* 主表 */}
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Table
              title={() => props.transferTitle?.mainTitle || '储能计量表'}
              rowSelection={{
                selectedRowKeys: mainSelectedKeys,
                onChange: (selectedRowKeys) => {
                  setMainSelectedKeys(selectedRowKeys)
                },
              }}
              columns={columns}
              dataSource={mainData}
              size="small"
              pagination={false}
              scroll={{
                y: 40
              }}
              onRow={(record) => ({
                onClick: (event) => {
                  // 避免点击行触发选择框
                  if (!event.target.closest('input[type="checkbox"]')) {
                    const isSelected = mainSelectedKeys.includes(record.key)
                    const newSelectedKeys = isSelected
                      ? mainSelectedKeys.filter(key => key !== record.key)
                      : [...mainSelectedKeys, record.key]
                    setMainSelectedKeys(newSelectedKeys)
                  }
                },
              })}
            />
          </div>

          {/* 负载表 */}
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Table
              title={() => props.transferTitle?.loadTitle || '负载总表'}
              rowSelection={{
                selectedRowKeys: loadSelectedKeys,
                onChange: (selectedRowKeys) => {
                  setLoadSelectedKeys(selectedRowKeys)
                },
              }}
              columns={columns}
              dataSource={loadData}
              size="small"
              pagination={false}
              scroll={{ y: 260 }}
              onRow={(record) => ({
                onClick: (event) => {
                  // 避免点击行触发选择框
                  if (!event.target.closest('input[type="checkbox"]')) {
                    const isSelected = loadSelectedKeys.includes(record.key)
                    const newSelectedKeys = isSelected
                      ? loadSelectedKeys.filter(key => key !== record.key)
                      : [...loadSelectedKeys, record.key]
                    setLoadSelectedKeys(newSelectedKeys)
                  }
                },
              })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
