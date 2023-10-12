import React, { useEffect, useMemo, useState,useContext,useRef } from 'react'
import { useSelector } from 'react-redux'
import {useAntdTable} from 'ahooks'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import Energyconsum from './energyconsum'
import Energymeter from './energymeter'
import Energytimeshare from './energytimeshare'
import UserSearch from "@com/useSerach";
import UserTable from "@com/useTable";
import UserTree from "@com/useTree"
import { Form, message, Select, Space, DatePicker, Button, Divider } from 'antd'
import moment from 'moment'
import styled from 'styled-components'
import {energyReport} from '@api/api'
import {selectProjectId,  selectOneLevelDefaultId} from '@redux/systemconfig.js'
const {
  QueryByArea, 
  QueryByLine, 
  QueryConsumeByArea,
  QueryConsumeByLine,
  QueryTimeConsumeByArea, 
  QueryTimeConsumeByLine,
  QueryClassifyConsume
} = energyReport
const Divbox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 32px;
  padding-left: 32px;
  border-left: 1px dotted #d7d7d7;
  flex:1;
`
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 48px 1fr;
  row-gap: 16px;
  flex: 1;
`
const Contentbox = styled.div`
  display: grid;
  grid-template-columns: 296px 1fr;
  column-gap: 16px;
  flex: 1;
`
const {Item} = Form
const getTime = (date, type)=> {
  let time
      if(type == 0) {
        time=date.format('YYYY-MM-DD')
    }else if(type == 1) {
        time = date.startOf("month").format('YYYY-MM-DD')
    }else if(type == 2) {
        time = date.startOf("year").format('YYYY-MM-DD')
    }
  return time
}

const cols =[ // 实时抄表
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
    title: '用能(kwh)',
    dataIndex: 'consume',
  }, {
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

const conscols =[ // 耗能用量
  {
    title: '设备名称',
    dataIndex: 'name', 
  },  
  {
    title: '设备编号',
    dataIndex: 'sn',
  },
  {
    title: '安装位置',
    dataIndex: 'address',
  },
  {
    title: '能耗(kwh)',
    dataIndex: 'consume',
  },   
]
const cellstyle = {
  textAlign: "center",
  color: "#fff"
}
const timecols =[  // 分时能耗 
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
    title: '设备编号',
    dataIndex: 'sn',
  }, 
  {
    title: '安装位置',
    dataIndex: 'address',
  }, 
]

const typecols =[  // 分时能耗 
  {
    title: '能耗类型',
    dataIndex: 'type', 
  },  
  {
    title: '子类型',
    dataIndex: 'subtType',
  },
  {
    title: '峰(kWh)',
    dataIndex: 'address',
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
  const areaId = useSelector(selectOneLevelDefaultId)
  const [value, setvalue] = useState('0')
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState([])
  const tabs = [
    { key: '0', label: '实时抄表' },
    { key: '1', label: '能耗抄表' },
    { key: '2', label: '分时能耗' },
    { key: '3', label: '分类能耗' },
  ]
  const [form]=Form.useForm()
  const projectId = useSelector(selectProjectId)
  const index = Number(value)
  const columns = [cols, conscols, timecols, typecols][index]

  const getTableData = ({ current, pageSize }, formData={}) => {
     const row = Number(value);
     
     let hander =row < 3 ? [
      [QueryByArea, QueryByLine], 
      [QueryConsumeByArea, QueryConsumeByLine],
      [QueryTimeConsumeByArea,QueryTimeConsumeByLine],
      ][row][line] : QueryClassifyConsume
     let {type, date, meterType} = formData
     let time = getTime(date, type)
     let params = {
        projectId,
        type,
        date: time,
        meterType,
        pageNum: current,
        pageSize,
     }
     console.log(params)
     return hander(params, treeId).then(res => {
         let {success, data} = res
         if(success && Array.isArray(data) && data.length > 0) {
          
           if(row == 1) {
             let {detailHeaders} = data[0]
             let column = detailHeaders.map(col => ({title: col, dataIndex: col}))
             row == 1 && [conscols, ...column];
             

             data.forEach(item => {
              let {detailHeaders, detailValues} = item;
              for(const [index, val] of detailHeaders?.entries()) {
                  item[val] = detailValues[index]
              }
            })
           }
           
         
            return {
              list: data,
              total: data.length
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
  const {tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultParams: [{current: 1, pageSize: 14}],
    refreshDeps: [areaId, treeId, value, line]
  })
  const { submit} = search;
  let Coms = [
    <Energymeter />,
    <Energyconsum />,
    <Energytimeshare />
  ]
  
  const [timetype, setTimetype] = useState(0) // 日、月、年 0,1,2
  const picker= ['date', 'month', 'year'][timetype];
  const timechange = (e) => { 
    setTimetype(e);
    submit()
 }
  const CustView = () => {
    
    return (
      <Divbox>
       <Space size={64} dashed split={<Divider type="vertical" style={{height: "100%"}}/>}>
        <Item  label="能源类型"   initialValue={1} name="meterType">
        <Select
        onChange={submit}
        style={{width: "112px"}}
        options={[
          {
            label: '电力',
            value: 1,
          },
          {
            label: '用水',
            value: 2,
          }]}
         />
        </Item>
        <Space>
        <Item  name="type" initialValue={0}>
           <Select style={{width: '80px'}}   options={[
            {value: 0, label: '日'},
            {value: 1, label: '月'},
            {value: 2, label: '年'},
           ]}
           onChange={timechange}
           ></Select>
        </Item>

        <Item nostyle name="date"  initialValue={moment(new Date(), 'YYYY-MM-DD')}>
          <DatePicker placeholder="请选择日期" picker={picker}  style={{width: '160px'}} onChange={submit} />
        </Item>  
        </Space>     
      </Space>
      <Space size={16}>
        <Button type="primary">查询</Button>
        <Button type="primary">导出</Button>
      </Space>
      </Divbox>
    )
  }
  
  let dataProps = {
    value,
    setvalue,
    tabs,
    form,
    custview: <CustView />,
  }
 


  return (
      <CustContext.Provider value={dataProps} >
          <Mainbox>
          <UserSearch></UserSearch>

          <Pagecount showSearch={false}>
             <Contentbox>
                <UserTree areaId={areaId} setTreeId={setTreeId} setLine={setLine} lineType={value} /> 
                 <UserTable columns={columns} {...tableProps} key="reading"></UserTable>
             </Contentbox>
          </Pagecount>
          </Mainbox>
      </CustContext.Provider>
  )
}


