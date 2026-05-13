import PageContent from '@com/pagecontent'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import UseTree from '@com/useTree'
import TitleLayout from '@com/titlelayout'
import { Flex, Space, Tooltip } from 'antd'
import HeadCardView from './components/HeadCardView'
import EnergyTrendChart from './components/EnergyTrendChart'
import IntensityTrendChart from './components/IntensityTrendChart'
import ComputerDescModal from './components/ComputerDescModal'
import { ExportExcel } from '@com/useButton'
import ProTable from '@com/useTable/proTable'
import { getTableColumns } from './Constant'
import { useOutletContext } from 'react-router-dom'
import { ReactComponent as NoticeIcon } from './icon/notice.svg'
import { ReactComponent as Icon1 } from './icon/icon_1.svg'
import { ReactComponent as Icon2 } from './icon/icon_2.svg'
import { ReactComponent as Icon3 } from './icon/icon_3.svg'

/**
 * 能耗强度计算
 */
export default function IntensityCal() {
  const [treeId, setTreeId] = useState([])
  const tableRef = useRef(null)
  const modalRef = useRef(null)
  let { exparams  } = useOutletContext()
  let { areaId, projectId, publictype:type, publicdate:date} = exparams

  
    const params = useMemo(()=>{
     let dateType = { 1: "day", 2: "month", 3: "year" }[type]
    return  {
        projectId,
        areaId: treeId,
        dateType,
        date,
      }
     
    }, [projectId, areaId, type, date, treeId])

  const onComputerDescClick = () => {
    modalRef.current?.showModal()
  }

  useEffect(() => {
    console.log('treeId--->', treeId)
  }, [treeId])

  const getTableData = async (params) => {
    return {
      data: [
        { areaName: '区域1', a: 100, b: 200, c: 1000, d: 25.36 },
        { areaName: '区域2', a: 100, b: 200, c: 1000, d: -25.36 },
        { areaName: '区域3', a: 100, b: 200, c: 1000, d: 1.36 },
        { areaName: '区域4', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域5', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域6', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域7', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域8', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域9', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域10', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域11', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域12', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域13', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域14', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域15', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域16', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域17', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域18', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域19', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域20', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域21', a: 100, b: 200, c: 1000, d: 0 },
        { areaName: '区域22', a: 100, b: 200, c: 1000, d: 0 },
      ],
      success: true,
      total: 4,
    }
  }

  return (
    <PageContent bgcolor="transparent" pd="0">
      <Flex gap={12} style={{ minHeight: '100%' }}>
        <Flex style={{ width: 265 }}>
          <UseTree
            title="区域列表"
            areaId={areaId}
            setTreeId={setTreeId}
            setLine={() => {}}
            showline={false}
            datatype={0}
            energytype={1}
            allselect={true}
            showSearch={true}
          />
        </Flex>
        <Flex flex={1} gap={12} vertical>
          <Flex gap={12} style={{ width: '100%' }}>
            <HeadCardView
              icon={<Icon1 />}
              title="总能源消费量"
              unit="tce(吨标准煤)"
              value={2235746.23}
              rate={-3.12}
              desc="较上月"
            />
            <HeadCardView
              icon={<Icon2 />}  
              title="单位产值能耗"
              unit="tce/万元产值"
              value={223.13}
              rate={6.08}
              desc="较上月"
            />
            <HeadCardView
              icon={<Icon3 />}  
              title="单位产品能耗"
              unit="tce/吨产品"
              value={365.25}
              rate={-32.14}
              desc="较上月"
            />
          </Flex>
          <Flex gap={12} style={{ minHeight: 320 }}>
            <EnergyTrendChart />
            <IntensityTrendChart />
          </Flex>
          <TitleLayout
            style={{ minHeight: 320 }}
            title={
              <Flex align="center" justify="space-between">
                <span>能耗强度明细</span>
                <Space size={16}>
                  <Flex
                    align="center"
                    style={{cursor:'pointer'}} 
                    gap={4} 
                    onClick={onComputerDescClick}
                  >
                    <NoticeIcon />
                    <div>计算说明</div>
                  </Flex>
                  <ExportExcel tb={tableRef} single={true} />
                </Space>
              </Flex>
            }
            layout="flex"
            dr="column"
          >
            <ProTable
              ref={tableRef}
              search={false}
              toolBarRender={false}
              rowKey="areaName"
              columns={getTableColumns()}
              request={getTableData}
              params={params}
              scroll={{ 
                x: 'max-content',
                y: 'calc(100vh - 780px)' 
              }}
            />
          </TitleLayout>
        </Flex>
      </Flex>
      <ComputerDescModal ref={modalRef} />
    </PageContent>
  )
}