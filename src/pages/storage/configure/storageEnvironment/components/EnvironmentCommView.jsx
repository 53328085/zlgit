import { useAntdTable, useMemoizedFn } from 'ahooks'
import { StorageDeviceDesigner, StorageEquipmentDesigner } from '@api/api'
import React, { useEffect, useRef, useState } from 'react'
import { message, Space } from 'antd'
import { CustButton } from '@com/useButton'
import styled from 'styled-components'
import CustomTable from '@com/useTable'
import CustomModal from '@com/useModal'
import EnvironmentSettingDialog from '@pages/storage/configure/storageEnvironment/components/EnvironmentSettingDialog'
import { getDeviceTitle, getTableColumns } from '@pages/storage/configure/storageEnvironment/Constant'

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

export default function EnvironmentCommView ({ tab, areaId, projectId, containerId, stationName = {} }) {
  const tableRef = useRef(null)
  const deleteDialogRef = useRef(null)
  const deviceSettingDialogRef = useRef(null)
  const { value: siteId = 0 } = stationName
  const [selectId, setSelectId] = useState(0)
  //分页相关数据
  const totalItem = useRef()
  const curPage = useRef()
  const PageSize = 14
  const [title, setTitle] = useState(tab)

  useEffect(() => {
    setTitle(getDeviceTitle(tab))
  }, [tab])

  /**
   * 刷新表格
   */
  const onRefreshClick = useMemoizedFn(() => {
    refresh()
  })

  /**
   * 配置按钮点击事件
   */
  const onSettingClick = useMemoizedFn(() => {
    deviceSettingDialogRef.current?.showDialog()
  })

  /**
   * 表格删除
   */
  const onTableDeleteClick = useMemoizedFn((record) => {
    setSelectId(record.sn)
    deleteDialogRef.current?.onOpen()
  })

  /**
   * 删除弹窗确认按钮点击事件
   */
  const onDialogDeleteClick = useMemoizedFn(async () => {
    if (!selectId) return
    try {
      let { success, errMsg } = await StorageDeviceDesigner.deleteStorageDeviceApi(projectId, selectId)
      if (success) {
        message.success('删除成功!')
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
    } catch (e) {
      message.error(e.message)
    }
  })

  /**
   * 获取表格数据
   */
  const getTableData = ({ current, pageSize }) => {
    const requiredParams = [projectId, areaId, siteId, containerId]
    if (requiredParams.some(param => param === undefined || param === null)) {
      return {
        list: [],
        total: 0
      }
    }
    curPage.current = current
    let params = { projectId, areaId, siteId, containerId, tab, pageNum: current, pageSize }
    return StorageDeviceDesigner.getStorageDeviceListByTabApi(params).then(res => {
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
    refreshDeps: [],
  })

  useEffect(() => {
    run({ current: 1, pageSize: PageSize })
  }, [projectId, tab, areaId, siteId, containerId])

  return (
    <>
      <CustomTitle>
        <Space>
          <div className="icon"></div>
          <div className="title">{title}列表</div>
        </Space>
        <CustButton onClick={onSettingClick} wh="auto" style={{ minWidth: '96px' }}>配置{title}</CustButton>
      </CustomTitle>
      <CustomTable
        ref={tableRef}
        scroll={{
          y: 'calc(100% - 200px)'
        }}
        columns={getTableColumns(tab, onTableDeleteClick)}
        rowKey="sn"
        sheetName={`${title}.xlsx`}
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
        是否确认删除{title}？
      </CustomModal>
      <EnvironmentSettingDialog
        ref={deviceSettingDialogRef}
        siteId={siteId}
        projectId={projectId}
        containerId={containerId}
        tab={tab}
        onRefreshClick={onRefreshClick}
      />
    </>
  )
}
