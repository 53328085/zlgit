import { useAntdTable, useMemoizedFn, useRequest } from 'ahooks'
import { Monitoring, StorageContainerDesigner, StorageEquipmentDesigner } from '@api/api'
import React, { useEffect, useRef, useState } from 'react'
import { message, Space } from 'antd'
import { isArray } from 'lodash'
import { CustButton } from '@com/useButton'
import { getDeviceTitle, getTableColumns } from '@pages/storage/configure/storageDevice/Constant'
import styled from 'styled-components'
import CustomTable from '@com/useTable'
import CustomModal from '@com/useModal'

const CustomTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #d7d7d7;
    padding-bottom: 16px;

    .icon {
        width: 3px;
        height: 13px;
        background-color: ${({ bl, theme }) => bl ? bl === 'none' ? 'transparent' : bl : theme.primaryColor};
    }

    .title {
        font-size: ${({ fz }) => fz || '15px'};
        color: ${({ fc, theme }) => theme.isdark ? 'dark' : (fc || theme.cardHeadlColor)};
        padding: 0 0 0 11px;
    }
`

export default function DeviceCommView ({ type, areaId, projectId, containerId, stationName = {} }) {
  const [alarmOptions, setAlarmOptions] = useState([])
  const tableRef = useRef(null)
  const deleteDialogRef = useRef(null)
  const { key: siteId = 0 } = stationName
  const [selectId, setSelectId] = useState(0)
  //分页相关数据
  const totalItem = useRef()
  const curPage = useRef()
  const PageSize = 14

  const { run: getAlarmOptions } = useRequest(() => Monitoring.DeviceManager.QueryPlanList(projectId), {
    manual: false,//是否手动执行
    onSuccess: ({ data, success, errMsg }) => {
      if (!success) {
        message.error(errMsg)
        setAlarmOptions([{ name: '不启用告警方案', id: 0 }])
        return
      }
      if (isArray(data)) {
        setAlarmOptions([{ name: '不启用告警方案', id: 0 }, ...data])
      } else {
        setAlarmOptions([{ name: '不启用告警方案', id: 0 }])
      }
    },
    onError: () => {
      setAlarmOptions([{ name: '不启用告警方案', id: 0 }])
    }
  })

  const onSettingClick = useMemoizedFn(() => {
    console.log('-type->', type)
  })

  const onTableDeleteClick = useMemoizedFn((record) => {
    setSelectId(record.id)
    deleteDialogRef.current?.onOpen()
  })

  const onDialogDeleteClick = useMemoizedFn(() => {
    if (!selectId) return
    let { success, errMsg } = StorageEquipmentDesigner.Delete(projectId, selectId)
    if (success) {
      message.success('电表删除成功!')
      let current = Math.ceil((totalItem.current - 1) / PageSize) < curPage.current
      if (current) {
        run({ current: curPage.current - 1, pageSize: PageSize })
      } else {
        refresh()
      }
      deleteDialogRef.current?.onCancel()
    } else {
      message.error({ content: errMsg || '数据出错', duration: 0.3 })
    }
  })

  useEffect(() => {
    if (!projectId) return
    getAlarmOptions()
  }, [projectId])

  const getTableData = ({ current, pageSize }) => {
    if (!projectId || !areaId || !siteId) {
      return {
        list: [],
        total: 0
      }
    }
    curPage.current = current
    let params = { projectId, areaId, siteId, pageNum: current, pageSize }
    return StorageContainerDesigner.GetContainers(params).then(res => {
      let { success, data, total } = res
      totalItem.current = Number.isInteger(total) ? total : 0
      if (success && Array.isArray(data) && data.length > 0) {
        return {
          list: data,
          total
        }
      } else {
        return {
          list: [],
          total: 0
        }
      }
    }).catch(e => {
      console.log(e)
    })
  }

  const { tableProps, refresh, run } = useAntdTable(getTableData, {
    defaultPageSize: PageSize,
    refreshDeps: [projectId],
  })

  useEffect(() => {
    run({ current: 1, pageSize: PageSize })
  }, [type, areaId, containerId, stationName])

  return (
    <>
      <CustomTitle>
        <Space>
          <div className="icon"></div>
          <div className="title">{getDeviceTitle(type)}列表</div>
        </Space>
        <CustButton onClick={onSettingClick}>配置{getDeviceTitle(type)}</CustButton>
      </CustomTitle>
      <CustomTable
        ref={tableRef}
        scroll={{
          y: 'calc(100% - 200px)'
        }}
        columns={getTableColumns(type, onTableDeleteClick)}
        rowKey="sn"
        sheetName={`${getDeviceTitle(type)}.xlsx`}
        {...tableProps}
      />
      <CustomModal
        title="删除提示"
        ref={deleteDialogRef}
        mold="cust"
        width={512}
        type="warn"
        onOk={onDialogDeleteClick}
        maskClosable={false}
      >
        是否确认删除{getDeviceTitle(type)}？
      </CustomModal>
    </>
  )
}
