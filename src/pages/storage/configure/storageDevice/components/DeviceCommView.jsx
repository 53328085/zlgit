import { useAntdTable, useMemoizedFn } from 'ahooks'
import { StorageDeviceDesigner } from '@api/api'
import React, { useEffect, useRef, useState } from 'react'
import { message, Space } from 'antd'
import { CustButton } from '@com/useButton'
import { getDeviceTitle, getTableColumns } from '@pages/storage/configure/storageDevice/Constant'
import styled from 'styled-components'
import CustomTable from '@com/useTable'
import CustomModal from '@com/useModal'
import DeviceSettingDialog from '@pages/storage/configure/storageDevice/components/DeviceSettingDialog'

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

/**
 * 设备配置列表
 * @param tab 页签标识
 * @param areaId
 * @param projectId
 * @param containerId 当前储能柜ID
 * @param stationName 当前站点ID
 */
export default function DeviceCommView ({ tab, areaId, projectId, containerId, stationName = {} }) {
  const tableRef = useRef(null)
  //删除弹窗
  const deleteDialogRef = useRef(null)
  //配置弹窗
  const deviceSettingDialogRef = useRef(null)
  const { value: siteId = 0 } = stationName
  //
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
          ? Math.max(1, curPage.current - 1)  // 确保页码最小为1
          : curPage.current
        if (current !== curPage.current) {
          // 如果删除后需要跳转页码
          run({ current: current, pageSize: PageSize })
        } else {
          // 直接刷新当前页数据
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
  const getTableData = async ({ current, pageSize }) => {
    const requiredParams = [projectId, areaId, siteId, containerId]
    if (requiredParams.some(param => param === undefined || param === null)) {
      return {
        list: [],
        total: 0
      }
    }
    curPage.current = current
    let params = { projectId, areaId, siteId, containerId, tab, pageNum: current, pageSize }
    try {
      const { success, data, total } = await StorageDeviceDesigner.getStorageDeviceListByTabApi(params)
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
    } catch (e) {
      console.log(e)
      return {
        list: [],
        total: 0
      }
    }
  }

  const { tableProps, refresh, run } = useAntdTable(getTableData, {
    defaultPageSize: PageSize,
    refreshDeps: [projectId, tab, containerId],  // 添加依赖项，确保参数变化时能更新
  })

  return (
    <>
      <CustomTitle>
        <Space>
          <div className="icon"></div>
          <div className="title">{title}列表</div>
        </Space>
        <CustButton wh="auto" style={{ minWidth: 96 }} onClick={onSettingClick}>配置{title}</CustButton>
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
      <DeviceSettingDialog
        ref={deviceSettingDialogRef}
        siteId={siteId}
        projectId={projectId}
        containerId={containerId}
        tab={tab}
        onRefreshClick={refresh}
        limit={[101, 102].includes(Number(tab)) ? 1 : 0} // 限制最多选中一个设备
      />
    </>
  )
}
