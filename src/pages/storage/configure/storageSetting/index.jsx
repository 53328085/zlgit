import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAntdTable, useMemoizedFn } from 'ahooks'
import UseTable from '@com/useTable'
import { message } from 'antd'
import {
  selectProjectId,
  publishState,
  levelDefaultLabel
} from '@redux/systemconfig.js'
import { SiteManagerDesigner } from '@api/api.js'
import PageContent from '@com/pagecontent'
import TitleLayout from '@com/titlelayout'
import CModal from '@com/useModal'
import { CustButtonT } from '@com/useButton'
import { getTableColumns } from '@pages/storage/configure/storageSetting/Constant'
import StorageInfoDialog from '@pages/storage/configure/storageSetting/components/StorageInfoDialog'

export default function Index () {
  const storageInfoDialogRef = useRef(null)
  const tableRef = useRef()
  const projectId = useSelector(selectProjectId)
  //权限 true-仅查看 false-可编辑
  const isPublish = useSelector(publishState)
  const areaFirstName = useSelector(levelDefaultLabel) || '园区'
  //删除弹窗
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  //分页相关参数
  const totalItem = useRef()
  const curPage = useRef()
  const PageSize = 14
  //编辑站点的ID
  const [selectId, setSelectId] = useState(0)

  /**
   * 获取表格数据
   */
  const getTableData = ({ current, pageSize }) => {
    curPage.current = current
    if (!projectId) return new Promise((resolve) => {
      resolve({
        list: [],
        total: 0
      })
    })
    return SiteManagerDesigner.GetSites(projectId, current, pageSize).then(res => {
      let { success, data, total } = res
      totalItem.current = Number.isInteger(total) ? total : 0
      if (success) {
        if (Array.isArray(data) && data?.length > 0) {
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
      } else {
        message.error(res.errMsg)
      }
    })
  }

  /**
   * 表格操作Hook
   */
  const { tableProps, refresh, run } = useAntdTable(getTableData, {
    defaultPageSize: PageSize,
    refreshDeps: [projectId]
  })

  /**
   * 新增站点
   */
  const onAddClick = () => {
    storageInfoDialogRef?.current?.showDialog(null)
  }
  /**
   * 表格编辑
   */
  const onTableEditClick = (record) => {
    storageInfoDialogRef?.current?.showDialog(record)
  }
  /**
   * 表格删除
   */
  const onTableDeleteClick = (record) => {
    setSelectId(record.id)
    setShowDeleteModal(true)
  }
  /**
   * 删除站点确认
   */
  const onDialogDeleteClick = async () => {
    let res = await SiteManagerDesigner.DeleteSite(projectId, selectId)
    if (res.success) {
      message.success('站点删除成功!')
      let current = Math.ceil((totalItem.current - 1) / PageSize) < curPage.current
      if (current) {
        run({ current: curPage.current - 1, pageSize: PageSize })
      } else {
        refresh()
      }
    } else {
      message.error(res.errMsg)
    }
    setShowDeleteModal(false)
  }

  /**
   * 表格刷新监听
   */
  const onRefreshClick = useMemoizedFn(() => {
    refresh()
  })

  const Title = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>站点管理</span>
      {!isPublish && (
        <CustButtonT
          text="new"
          src="new"
          onClick={onAddClick}
        />
      )}
    </div>
  )

  return (
    <PageContent showserach={false} custserach pd="0px">
      <TitleLayout title={Title} layout="flex" dr="column">
        <UseTable
          rowKey={(record) => record.id}
          ref={tableRef}
          columns={getTableColumns(isPublish, areaFirstName, onTableEditClick, onTableDeleteClick)}
          {...tableProps}
        />
      </TitleLayout>
      <CModal
        open={showDeleteModal}
        onOk={onDialogDeleteClick}
        onCancel={() => setShowDeleteModal(false)}
        width={512}
        closable={false}
        type="warn"
        mold="cust"
        title="删除提示"
        key="ma"
      >
        是否确认删除站点？
      </CModal>
      <StorageInfoDialog ref={storageInfoDialogRef} onRefreshClick={onRefreshClick}/>
    </PageContent>
  )
}
