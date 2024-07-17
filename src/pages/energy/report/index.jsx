import React, { useState,useCallback,useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {useOutletContext} from 'react-router-dom'
import {useAntdTable} from 'ahooks'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import UserTable from "@com/useTable";
import UserTree from "@com/useTree"
import { Space} from 'antd'
import {getTime} from '@com/usehandler'
import styled from 'styled-components'
import {energyReport} from '@api/api'
import {levelDefaultLabel} from '@redux/systemconfig.js'
import {  ExportExcel} from '@com/useButton'
const {
  QueryByArea, 
  QueryByLine, 
  QueryConsumeByArea,
  QueryConsumeByLine,
  QueryTimeConsumeByArea, 
  QueryTimeConsumeByLine,
  QueryClassifyConsume
} = energyReport
 
const Contentbox = styled.div`
  display: grid;
  grid-template-columns: 296px 1334px;
  column-gap: 16px;
  flex: 1;
`
 
const cols =[ // 实时抄表  
{
  title: '名称',
  dataIndex: 'nodeName', 
},
  {
    title: '设备名称',
    dataIndex: 'name', 
  }, {
    title: '起始读数',
    dataIndex: 'start',
    
  }, {
    title: '结束读数',
    dataIndex: 'end',
  },
  {
    title: '用能(kWh)',
    dataIndex: 'consume',
  }, 
  {
    title: '设备编号',
    dataIndex: 'sn',
  },
  {
    title: '安装位置',
    dataIndex: 'address',
  },
]

let conscols =[ //  cols 实时抄表，  conscols 能耗报表 , typecols 分类能耗
{
  title: '名称',
  dataIndex: 'nodeName', 
  key: "nodeName",
  fixed: 'left',
  width: 100
},
{
    title: '设备名称',
    dataIndex: 'name', 
    width: 84,
    key: "name",
    fixed: 'left',
  },  
  {
    title: '设备编号',
    dataIndex: 'sn',
    width:134,
    key: "sn",
    fixed: 'left',
  },
  {
    title: '安装位置',
    dataIndex: 'address',
    key: 'address',
    width: 84,
  },
  {
    title: '能耗(kWh)',
    dataIndex: 'total',
    key: 'total',
    width: 92,
  },   
]
const cellstyle = {
  textAlign: "center",
  color: "#fff"
}
const timecols =[  // 分时能耗 
{
  title: '名称',
  dataIndex: 'nodeName', 
},
{
    title: '设备名称',
    dataIndex: 'name', 
  },  
  {
    title: '总计(kWh)',
    dataIndex: 'e',
    onHeaderCell: () => ({
      style: {
        background: "#000",
        ...cellstyle
      }
    })
  },
  {
    title: '峰(kWh)',
    dataIndex: 'e2',
    onHeaderCell: () => ({
      style: {
        background: "#f33",
        ...cellstyle
      }
    })
  },
  {
    title: '平(kWh)',
    dataIndex: 'e3',
    onHeaderCell: () => ({
      style: {
        background: "#f90",
        ...cellstyle
      }
    })
  },  
  {
    title: '谷(kWh)',
    dataIndex: 'e4',
    onHeaderCell: () => ({
      style: {
        background: "#093",
        ...cellstyle
      }
    })

  },  
  {
    title: '费用',
    dataIndex: 'cost',
  },
  {
    title: '设备编号',
    dataIndex: 'sn',
  }, 
  {
    title: '安装位置',
    dataIndex: 'address',
  }, 
]

const typecols =[  // 分类能耗 
  {
    title: '能耗类型',
    dataIndex: 'type', 
  },  
  {
    title: '子类型',
    dataIndex: 'subType',
  },  
  {
    title: '能耗(kWh)',
    dataIndex: 'consume',
  },  
  {
    title: '同比',
    dataIndex: 'yoy',
  }, 
  {
    title: '环比',
    dataIndex: 'mom',
  }, 
]

export default function Index() {

  let {exparams, setCustview} = useOutletContext() 

  console.log(exparams)
 
  const levelname = useSelector(levelDefaultLabel)
  const [value, setvalue] = useState('0')
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let {areaId, projectId, type, date, energytype} = exparams
  conscols[0].title = levelname
  cols[0].title = levelname
  timecols[0].title = levelname
  const [concolumns, setConcolumns] = useState(conscols) 
  const [total, setTotal] = useState(0)
  const tbref = useRef()
  const etabs = [
    { key: '0', label: '实时抄表' },
    { key: '1', label: '能耗报表' },
    { key: '2', label: '分时能耗' },
    { key: '3', label: '分类能耗' },
  ]
  const wtabs = [
    { key: '0', label: '实时抄表' },
    { key: '1', label: '能耗报表' },
    { key: '3', label: '分类能耗' },
  ]
  const [tabs, setTabs] = useState(etabs)
  const index = Number(value)
  const sheetName = tabs[index]?.label ?? 'sheet'
  let columns = [cols, [], timecols, typecols][index] // 
  const getTableData = ({ current, pageSize }) => {
  //  const row = Number(value);
   //  console.log(exparams)
     console.log(treeId)
     if(Object.values(exparams).length <5 || !Array.isArray(treeId)) return;
      
     let hander =index < 3 ? [
      [QueryByArea, QueryByLine], 
      [QueryConsumeByArea, QueryConsumeByLine],
      [QueryTimeConsumeByArea,QueryTimeConsumeByLine],
      ][index][line] : QueryClassifyConsume
    // let {type, date, meterType} = formData
     let time = getTime(date, type)
     let params = {
        projectId,
        type,
        date: time,
        meterType: energytype,
        pageNum: current,
        pageSize,
        areaId,
     }
     // //  cols 实时抄表，  conscols 能耗报表 , typecols 分类能耗
     if(energytype == 1) {
      setTabs([...etabs])
     }else if(energytype == 2) {
      setTabs([...wtabs])
     }
   
     columns.forEach(c => {
             if(c.dataIndex == 'consume' && index == 0) { // 实时抄表
                c.title = energytype == 1 ? '用能(kWh)' : '差值（m³）'
             }
             if (c.dataIndex == 'consume' && index == 3) {  // 分类报表
              c.title = energytype == 1 ? '用能(kWh)' : '用水量（m³）'
             }
           })
       
      
    if(index == 1) {
      conscols.forEach(e => {
        if(e.dataIndex == 'total') {
           e.title = energytype == 1 ? '能耗(kWh)' : '能耗（m³）'
        }
      })
    }
  


     return hander(params, treeId).then(res => {
         let {success, data, total=0} = res
         setTotal(total)
         if(success && Array.isArray(data) && data.length > 0) {           
           if(index == 1) {
             let {detailHeaders} = data[0]
             let last = detailHeaders.length - 1
             let column = detailHeaders.map(col => ({title: col, dataIndex: col, key: col,width: "96px" }))
             column[last].fixed = "right"
             setConcolumns([...conscols, ...column])
             data.forEach(item => {
              let {detailHeaders, detailValues} = item;
              for(const [index, val] of detailHeaders?.entries()) {
                  item[val] = detailValues[index]
              }
            })
           }
           
         
            return {
              list: data,
              total: total
            }
         }else {
          return {
            list: [],
            total: 0
          }
         }
     }).catch(e => {
      console.log(e)
     })


  }
  const {tableProps} = useAntdTable(getTableData, {
    defaultParams: [{current: 1, pageSize: 14}],
    refreshDeps: [exparams, treeId, value, line]
  })

  const CustView =(
    <Space size={16}>
      <ExportExcel tb={tbref} />
     </Space>
    )
  const onExport =useCallback(() => {   
   
    return  getTableData({current: 1, pageSize: total})
 }, [total, concolumns])
  
  let dataProps = {
    value,
    setvalue,
    tabs,
  //  form,
  //  custview: <CustView />,
  }
 useEffect(() => {
  setCustview(CustView);
  return () => {
    setCustview(undefined)
  }
 }, [])


  return (
      <CustContext.Provider value={dataProps} >
          <Pagecount showSearch={false} custserach={true}>
             <Contentbox>
                <UserTree areaId={areaId}   setTreeId={setTreeId} setLine={setLine}   showline={value!='3'} datatype={value=='3' ? 0 : NaN}   /> 
                {
                  value == "1" ? <UserTable ref={tbref}  columns={concolumns} {...tableProps} key={value} scroll={{
                    scrollToFirstRowOnChange: true,
                     x: 1400, 
                     y: 685
                   }
                  }
                  sheetName={sheetName} onExport={onExport}
                  ></UserTable>
                  :<UserTable ref={tbref} columns={columns} {...tableProps} key={value} sheetName={sheetName} onExport={onExport}></UserTable>
                } 
             </Contentbox>
          </Pagecount>
      </CustContext.Provider>
  )
}


