import PageContent from '@com/pagecontent'
import styled from 'styled-components'
import { message, Radio, Space } from 'antd'
import UseTree from '@com/useTree'
import UseTable from '@com/useTable'
import TitleLayout from '@com/titlelayout'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig'
import { useOutletContext } from 'react-router-dom'
import { useMemoizedFn } from 'ahooks'
import { energyShare } from '@api/api'
import CustomChartView from '@com/useEcharts/Ichart'
import { getTime } from '@com/usehandler'
import {
  convertToMarkAreaData,
  DefaultOptions, DefaultSingleOptions,
  getRightTableColumns,
  getTableColumns
} from '@pages/energy/timePeriodEnergy/Constant'
import { ExportExcel } from '@com/useButton'

const { getTimePeriodEnergyApi, getLastTimePeriodInfoApi } = energyShare
const CustomPageContent = styled(PageContent)`
    margin-bottom: 16px;
`
const MainView = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: 300px 2fr 1fr;
    column-gap: 16px;

    .tree-view {
        display: grid;
        grid-template-rows: 32px 32px 604px;
        row-gap: 32px;

        span.ant-radio + * {
            padding: ${props => props.laptop ? 'padding: 0px' : 'padding: 0 8px'};
        }

        .ant-tree {
            overflow-y: auto;
        }
    }

    .right-layout {
        display: grid;
        grid-template-rows: 504px 1fr;
        row-gap: 16px;
    }

    .chart {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`
const CustomTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export default function Index () {
  // 树类型 1-线路 0-网格
  const [treeType, setTreeType] = useState(0)
  // 显示图表或表格 1-图表 2-表格
  const [showChartOrTable, setShowChartOrTable] = useState(1)
  const projectId = useSelector(selectProjectId)
  let { exparams } = useOutletContext()
  // areaId-区域ID date-日期 type-日期类型
  const { areaId, date, type } = exparams
  // 选中树节点id
  const [selectedKeys, setSelectedKeys] = useState([])
  const [markAreaData, setMarkAreaData] = useState({ data: [] })
  // 能耗数据
  const [energyDataList, setEnergyDataList] = useState([])
  // 表格对象
  const tableRef = useRef()

  /**
   * 获取分时能耗数据
   */
  const getData = useMemoizedFn(async () => {
    try {
      let time = getTime(date, type)
      let params = {
        projectId,
        type,
        date: time,
        ids: selectedKeys,
        queryType: treeType
      }
      let result = await getTimePeriodEnergyApi(params)
      let { success, data, errMsg } = result
      if (success && data) {
        setEnergyDataList({ ...data })
      } else {
        message.error(errMsg)
        setEnergyDataList({})
      }
    } catch (error) {
      console.log(error)
    }
  })

  /**
   * 获取日分时方案
   */
  const getTimePeriodInfo = useMemoizedFn(async () => {
    try {
      if (type !== 1) return
      let time = getTime(date, type)
      let params = {
        projectId,
        enableDate: time
      }
      const result = await getLastTimePeriodInfoApi(params)
      let { success, data, errMsg } = result
      if (success && data) {
        const markAreaData = convertToMarkAreaData(data)
        setMarkAreaData(markAreaData)
      } else {
        message.error(errMsg)
        setMarkAreaData({ data: [] })
      }
    } catch (error) {
      console.log(error)
    }
  })

  /**
   * 根据获取的接口数据，初始化图表数据、分时占比数据
   */
  const [chartOptions, tableData, pieOptions, momYoy] = useMemo(() => {
    //结构接口数据
    let {
      detail = {},
      proportion = [],
      momYoy
    } = energyDataList
    //获取明细
    const {
      x = [],
      y = [],
      y1 = [],
      y2 = [],
      y3 = []
    } = detail

    let tableData = []
    //组织表格数据
    if (x.length > 0) {
      tableData = x.map((dateTime, index) => {
        const tariffTimeType1 = parseFloat(y[index] || 0).toFixed(2)
        const tariffTimeType2 = parseFloat(y1[index] || 0).toFixed(2)
        const tariffTimeType3 = parseFloat(y2[index] || 0).toFixed(2)
        const tariffTimeType4 = parseFloat(y3[index] || 0).toFixed(2)
        const totalEnergy = (
          parseFloat(tariffTimeType1) +
          parseFloat(tariffTimeType2) +
          parseFloat(tariffTimeType3) +
          parseFloat(tariffTimeType4)
        ).toFixed(2)

        return {
          dateTime,
          tariffTimeType1,
          tariffTimeType2,
          tariffTimeType3,
          tariffTimeType4,
          totalEnergy
        }
      })
    }

    //总计
    const total = `${proportion.map(p => parseFloat(p.value, 2)).reduce((a, b) => a + b, 0)?.toFixed(2)} kWh`
    return [
      type === 1 ? {
          ...DefaultSingleOptions,
          series: [
            {
              type: 'bar',
              seriesLayoutBy: 'row',
              tooltip: {
                valueFormatter: value => value + 'kWh'
              },
              markArea: markAreaData
            }
          ],
          dataset: {
            dimensions: [
              { name: 'x', type: 'time' },
              { name: 'y', displayName: '分时能耗' }
            ],
            source: [
              x.map(time => time.replace(/^(\d):/, '0$1:')), // 格式
              y
            ],
            sourceHeader: false //false（默认值）：所有行/列都被视为纯数据
          }
        } :
        {
          ...DefaultOptions,
          dataset: {
            dimensions: [
              { name: 'x', type: 'time' },
              { name: 'y', displayName: '尖能耗' },
              { name: 'y1', displayName: '峰能耗' },
              { name: 'y2', displayName: '平能耗' },
              { name: 'y3', displayName: '谷能耗' },
            ],
            source: [
              x.map(time => time.replace(/^(\d):/, '0$1:')), // 格式化时间
              y, y1, y2, y3
            ],
            sourceHeader: false //false（默认值）：所有行/列都被视为纯数据
          }
        },
      tableData,
      {
        pieData: {
          data: proportion,
          total,
          radius: ['45%', '65%']
        },
        type: 3,
        legend: {
          bottom: 0,
          top: 'auto',
          itemGap: 16,
          type: 'scroll'
        },
        grid: {
          bottom: 20
        }
      },
      momYoy
    ]
  }, [energyDataList])

  /**
   * 根据日期、日期类型、下拉树节点id获取数据
   */
  useEffect(() => {
    if (date && Array.isArray(selectedKeys)) {
      if (type === 1) {
        getTimePeriodInfo()
        getData()
      } else {
        getData()
      }
    }
  }, [date, selectedKeys, type])

  return (
    <CustomPageContent bgcolor="transparent" pd="0">
      <MainView>
        <UseTree
          areaId={areaId}
          setTreeId={setSelectedKeys}
          setLine={setTreeType}
          showline={true}
          allselect
          multiple
          datatype={treeType === 0 ? 0 : 4}
          energytype={1}
          scroll="100%"
        />
        <TitleLayout
          title={
            <CustomTitle>
              <span>分时能耗</span>
              <Space size={16}>
                <Radio.Group
                  options={[
                    {
                      label: '图表模式',
                      value: 1
                    },
                    {
                      label: '列表模式',
                      value: 2
                    }
                  ]}
                  buttonStyle="solid"
                  optionType="button"
                  value={showChartOrTable}
                  onChange={(e) => setShowChartOrTable(e.target.value)}
                />
                <ExportExcel tb={tableRef} single={true} disabled={showChartOrTable === 1}/>
              </Space>
            </CustomTitle>
          }
          key="stack"
          layout="flex"
        >
          {
            showChartOrTable === 1 &&
            <div className="chart">
              <CustomChartView {...chartOptions} />
            </div>
          }
          {
            showChartOrTable === 2 &&
            <div className="chart">
              <UseTable
                ref={tableRef}
                key="dateTime"
                columns={getTableColumns()}
                dataSource={tableData}
                scroll={{ y: 'calc(100vh - 284px)' }}
              />
            </div>
          }
        </TitleLayout>
        <div className="right-layout">
          <TitleLayout title="分时占比" key="pie" layout="flex">
            <div className="chart">
              <CustomChartView {...pieOptions} />
            </div>
          </TitleLayout>
          <TitleLayout title="分时能耗同环比" key="momyoy">
            <div className="chart">
              <UseTable
                columns={getRightTableColumns()}
                dataSource={momYoy}
              />
            </div>
          </TitleLayout>
        </div>
      </MainView>
    </CustomPageContent>
  )
}
