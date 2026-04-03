import PageContent from '@com/pagecontent'
import TitleLayout from '@com/titlelayout'
import { message, Switch } from 'antd'
import styled from 'styled-components'
import { CustButton } from '@com/useButton'
import UserTable from '@com/useTable'
import { useMemoizedFn, useRequest } from 'ahooks'
import { useRef, useState } from 'react'
import { getColumns } from '@pages/runtimeEnergy/configure/timePeriodSetting/Constant'
import { selectProjectId } from '@redux/systemconfig'
import { useSelector } from 'react-redux'
import { EnergyManagement } from '@api/api'
import TimePeriodInfoDialog from '@pages/runtimeEnergy/configure/timePeriodSetting/TimePeriodInfoDialog'
import { isArray } from 'lodash'

const ContentView = styled.div`
    padding-top: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    row-gap: 16px;

    .add {
        display: flex;
        justify-content: space-between;

        .enable {
            display: flex;
            align-content: center;
            column-gap: 16px;
        }
    }
`

/**
 * 分时费率配置
 */
export default function Index () {
  const timePeriodInfoDialogRef = useRef(null)
  //项目id
  const projectId = useSelector(selectProjectId)
  //是否启用
  const [status, setStatus] = useState(false)
  //表格数据
  const [tableData, setTableData] = useState([])

  /**
   * 新增分时能耗时段设置
   */
  const onAddClick = useMemoizedFn(() => {
    timePeriodInfoDialogRef.current?.showDialog(null)
  })

  /**
   * 表格内编辑
   */
  const onTableEditClick = useMemoizedFn((record) => {
    timePeriodInfoDialogRef.current?.showDialog(record)
  })

  /**
   * 表格内删除
   */
  const onTableDeleteClick = useMemoizedFn(async ({ enableDate }) => {
    EnergyManagement.deleteTimePeriodSettingInfoApi({ projectId, enableDate })
      .then(({ success, errMsg }) => {
        if (success) {
          message.success('删除成功')
          getTableData({ projectId })
        } else {
          message.error(errMsg)
        }
      })
      .catch(err => {
        message.error(err.message)
      })
  })

  /**
   * 切换启用状态
   */
  const onStatusChange = useMemoizedFn((checked) => {
    EnergyManagement.updateProjectTimePeriodSettingStatusApi({ projectId, enable: checked ? 1 : 0 })
      .then(({ success, errMsg }) => {
        if (success) {
          message.success(checked ? '启用成功' : '关闭成功')
          setStatus(checked)
        } else {
          message.error(errMsg)
        }
      })
      .catch(err => {
        message.error(err.message)
      })
  })

  /**
   * 获取分时能耗时段设置
   */
  const { run: getTableData } = useRequest(EnergyManagement.getTimePeriodSettingInfoListApi, {
    defaultParams: [{ projectId }], // 参数需用数组包裹
    onSuccess: ({ success, data, errMsg }) => {
      if (success && isArray(data?.timeShares)) {
        setTableData(data?.timeShares)
      } else {
        message.error(errMsg)
        setTableData([])
      }
    },
    manual: false,
    refreshDeps: [projectId]
  })

  /**
   * 获取分时能耗时段设置
   */
  const { run: getStatus } = useRequest(EnergyManagement.getProjectTimePeriodSettingStatusApi, {
    defaultParams: [{ projectId }], // 参数需用数组包裹
    onSuccess: ({ success, errMsg, data }) => {
      if (success) {
        setStatus(data === 1)
      } else {
        message.error(errMsg)
      }
    },
    manual: false,
    refreshDeps: [projectId]
  })

  return (
    <PageContent pd="0" bgcolor="">
      <TitleLayout title="分时方案设置" layout="flex">
        <ContentView>
          <div className="add">
            <div className="enable">
              <span>是否启用</span>
              <Switch
                checkedChildren="启用"
                unCheckedChildren="关闭"
                checked={status}
                onChange={onStatusChange}
              />
            </div>
            <CustButton onClick={onAddClick}>新增</CustButton>
          </div>
          <UserTable
            columns={getColumns(onTableEditClick, onTableDeleteClick)}
            dataSource={tableData}
            rowKey="enableDate"
          />
        </ContentView>
      </TitleLayout>
      <TimePeriodInfoDialog ref={timePeriodInfoDialogRef} onRefreshClick={() => getTableData({ projectId })}/>
    </PageContent>
  )
}
