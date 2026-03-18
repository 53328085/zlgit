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

/**
 * 站点管理页面组件
 * 用于展示和管理站点信息，支持增删改查操作
 */
export default function Index () {
  //引用StorageInfoDialog组件实例，用于显示站点信息对话框
  const storageInfoDialogRef = useRef(null)
  //引用表格组件实例
  const tableRef = useRef()
  //获取当前项目ID
  const projectId = useSelector(selectProjectId)
  //获取发布状态，用于判断用户权限（true-仅查看 false-可编辑）
  const isPublish = useSelector(publishState)
  //获取区域层级默认名称，如"园区"
  const areaFirstName = useSelector(levelDefaultLabel) || '园区'
  //控制删除确认弹窗的显示状态
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  //用于存储总记录数的引用
  const totalItem = useRef()
  //用于存储当前页码的引用
  const curPage = useRef()
  const PageSize = 14
  //当前选中要编辑/删除的站点ID
  const [selectId, setSelectId] = useState(0)

  /**
   * 获取表格数据的异步函数
   * @param {Object} params - 分页参数
   * @param {number} params.current - 当前页码
   * @param {number} params.pageSize - 每页记录数
   * @returns {Promise<Object>} 表格数据Promise
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
   * 表格操作Hook，包含表格属性、刷新和执行功能
   */
  const { tableProps, refresh, run } = useAntdTable(getTableData, {
    defaultPageSize: PageSize,
    refreshDeps: [projectId]
  })

  /**
   * 新增站点按钮点击事件处理函数
   */
  const onAddClick = () => {
    storageInfoDialogRef?.current?.showDialog(null)
  }
  /**
   * 表格编辑按钮点击事件处理函数
   * @param {Object} record - 要编辑的表格行数据
   */
  const onTableEditClick = (record) => {
    storageInfoDialogRef?.current?.showDialog(record)
  }
  /**
   * 表格删除按钮点击事件处理函数
   * @param {Object} record - 要删除的表格行数据
   */
  const onTableDeleteClick = (record) => {
    setSelectId(record.id)
    setShowDeleteModal(true)
  }
  /**
   * 删除站点确认按钮点击事件处理函数
   * @returns {Promise<void>} 删除操作的Promise
   */
  const onDialogDeleteClick = async () => {
    let res = await SiteManagerDesigner.DeleteSite(projectId, selectId)
    if (res.success) {
      message.success('站点删除成功!')
      let current = Math.ceil((totalItem.current - 1) / PageSize) < curPage.current
        ? Math.max(1, curPage.current - 1)  // 确保页码最小为1
        : curPage.current;
      if (current !== curPage.current) {
        // 如果删除后需要跳转页码
        run({ current: current, pageSize: PageSize })
      } else {
        // 直接刷新当前页数据
        refresh()
      }
    } else {
      message.error(res.errMsg)
    }
    setShowDeleteModal(false)
  }

  /**
   * 表格刷新监听函数，用于刷新表格数据
   */
  const onRefreshClick = useMemoizedFn(() => {
    refresh()
  })

  /**
   * 页面标题组件
   */
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
