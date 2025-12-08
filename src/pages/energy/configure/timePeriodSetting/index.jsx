import PageContent from '@com/pagecontent'
import TitleLayout from '@com/titlelayout'
import { Switch } from 'antd'
import styled from 'styled-components'
import { CustButton } from '@com/useButton'
import UserTable from '@com/useTable'
import { useMemoizedFn, useRequest } from 'ahooks'
import { useRef, useState } from 'react'
import { getColumns } from '@pages/energy/configure/timePeriodSetting/Constant'
import { selectProjectId } from '@redux/systemconfig'
import { useSelector } from 'react-redux'
import { EnergyManagement } from '@api/api'
import TimePeriodInfoDialog from '@pages/energy/configure/timePeriodSetting/TimePeriodInfoDialog'

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
  const [searchStatus, setSearchStatus] = useState(false)
  //是否新增
  const [isAdd, setIsAdd] = useState(true)
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
  const onTableDeleteClick = useMemoizedFn((record) => {
    console.log('onTableDeleteClick', record)
  })

  /**
   * 切换启用状态
   */
  const onSearchStatusChange = useMemoizedFn((checked) => {
    setSearchStatus(checked)
  })

  /**
   * 获取分时能耗时段设置
   */
  const { run: getTableData } = useRequest(EnergyManagement.getTimePeriodSettingInfoApi, {
    onSuccess: (res) => {
      console.log('res', res)
    },
    manual: false,
    refreshDeps: [projectId]
  })

  return (
    <PageContent pd="0" bgcolor=''>
      <TitleLayout title="分时设置" layout="flex">
        <ContentView>
          <div className="add">
            <div className="enable">
              <span>是否启用</span>
              <Switch
                checkedChildren="启用"
                unCheckedChildren="关闭"
                checked={searchStatus}
                onChange={onSearchStatusChange}
              />
            </div>
            <CustButton onClick={onAddClick}>新增</CustButton>
          </div>
          <UserTable
            columns={getColumns(onTableEditClick, onTableDeleteClick)}
            dataSource={tableData}
          />
        </ContentView>
      </TitleLayout>
      <TimePeriodInfoDialog ref={timePeriodInfoDialogRef}/>
    </PageContent>
  )
}
