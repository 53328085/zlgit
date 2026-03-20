import React, { useRef, useState } from 'react'
import PageContent from '@com/pagecontent'
import CustomModal from '@com/useModal'
import { useSelector } from 'react-redux'
import { selectProjectId, selectOneLevelDefaultId, levelDefaultLabel } from '@redux/systemconfig.js'
import TitleLayout from '@com/titlelayout'
import { CustButtonT } from '@com/useButton'
import CustomTable from '@com/useTable'
import { getTableColumns } from '@pages/storage/configure/container/Constant'
import { useAntdTable, useMemoizedFn } from 'ahooks'
import styled from 'styled-components'
import { StorageContainerDesigner } from '@api/api'
import { message } from 'antd'
import ContainerInfoDialog from '@pages/storage/configure/container/components/ContainerInfoDialog'

const MainView = styled.div`
    && {
        flex: 1;
        color: #515151;
        display: flex;
        height: 100%;
    }
`

export default function Index () {
  // 获取当前项目的ID
  const projectId = useSelector(selectProjectId)
  // 删除确认弹窗的引用
  const deleteDialogRef = useRef(null)
  // 容器信息对话框的引用
  const containerInfoDialogRef = useRef(null)
  // 获取一级默认区域ID
  const areaId = useSelector(selectOneLevelDefaultId)
  // 获取默认层级标签
  const levelLabel = useSelector(levelDefaultLabel)
  // 分页相关数据 - 总条数
  const totalItem = useRef()
  // 分页相关数据 - 当前页码
  const curPage = useRef()
  // 每页显示条数
  const PageSize = 14
  // 当前选中要编辑的储能柜ID
  const [selectId, setSelectId] = useState(0)

  // 刷新表格数据的函数
  const onRefreshClick = useMemoizedFn(() => {
    refresh()
  })

  /**
   * 新增储能柜按钮点击事件
   * 打开容器信息对话框用于新增储能柜
   */
  const onAddContainerClick = useMemoizedFn(() => {
    containerInfoDialogRef.current?.showDialog(null, areaId)
  })

  /**
   * 表格编辑按钮点击事件
   * 打开容器信息对话框用于编辑指定储能柜
   * @param {Object} record - 要编辑的储能柜记录
   */
  const onTableEditClick = useMemoizedFn((record) => {
    containerInfoDialogRef.current?.showDialog(record, record.areaId)
  })

  /**
   * 表格删除按钮点击事件
   * 设置要删除的储能柜ID并打开删除确认弹窗
   * @param {Object} record - 要删除的储能柜记录
   */
  const onTableDeleteClick = useMemoizedFn((record) => {
    setSelectId(record.id)
    deleteDialogRef.current?.onOpen()
  })

  /**
   * 删除弹窗确认按钮点击事件
   * 执行删除储能柜操作，删除后刷新表格数据
   */
  const onDialogDeleteClick = useMemoizedFn(async () => {
    if (!selectId) return
    let { success, errMsg } = await StorageContainerDesigner.DeleteContainer(projectId, selectId)
    if (success) {
      message.success('删除成功!')
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
      deleteDialogRef.current?.onCancel()
    } else {
      message.error({ content: errMsg || '数据出错', duration: 0.3 })
    }
  })

  /**
   * 获取表格数据的函数
   * 用于分页和查询储能柜列表数据
   * @param {Object} params - 分页参数
   * @param {number} params.current - 当前页码
   * @param {number} params.pageSize - 每页条数
   * @returns {Promise} 表格数据Promise
   */
  const getTableData = ({ current, pageSize }) => { // areaId, sisteId 参数暂时设置为0 ，后续需求改变后再加
    curPage.current = current
    let params = { projectId, areaId: 0, siteId: 0, pageNum: current, pageSize }
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

  // 使用ahooks的useAntdTable Hook处理表格逻辑
  const { tableProps, refresh, run } = useAntdTable(getTableData, {
    defaultPageSize: PageSize,
    refreshDeps: [projectId],
  })

  return (
    <PageContent pd="0px" bgcolor="">
      <TitleLayout title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>储能柜管理</span>
          <CustButtonT text="new" src="new" onClick={onAddContainerClick}/>
        </div>
      }>
        <MainView>
          <CustomTable
            columns={getTableColumns(levelLabel, onTableEditClick, onTableDeleteClick)}
            {...tableProps}
          />
        </MainView>
        <CustomModal
          width={592}
          title="操作提示"
          ref={deleteDialogRef}
          mold="cust"
          type="warn"
          onOk={onDialogDeleteClick}
        >
          是否确认删除储能柜?
        </CustomModal>
      </TitleLayout>
      <ContainerInfoDialog ref={containerInfoDialogRef} onRefreshClick={onRefreshClick}/>
    </PageContent>
  )
}
