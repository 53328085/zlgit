import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions,Tag, Divider } from 'antd'
import {CaretRightOutlined, CaretUpFilled, CaretDownFilled}  from '@ant-design/icons'
import {nanoid} from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import {StorageAlarmruntime} from '@api/api'
import imgurl from './icon'
const {Text, Link, Title, Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && {
      display: grid;
      grid-template-rows: 96px 688px;
      row-gap: 16px;
      .items {
         display: flex;
         justify-content: space-between;
         align-items: center;
        .item {
          width: 200px;
          height: 96px;
          background-color: rgba(255, 255, 255, 1); 
          border: 1px solid rgba(215, 215, 215, 1); 
          border-radius: 4px; 
          box-shadow: none;
          padding: 16px 8px;
          display: grid;
          grid-template-columns: 48px 1fr;
          align-items: center;
          justify-items: center;
          .info {
            width: 114px;
            height: 64px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
          } 
        }
        .item.small {
          width: 138px;
          .info {
            width: 58px;
          }
         
        }
      }
      .content {
        display: grid;
        grid-template-rows: 32px 4px 1fr;
        row-gap: 16px; 
        flex: 1;
        color:#515151;
        padding-top: 16px;
        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

        }
      }
       
       }

`
const P = styled(Paragraph)`
&& {
  margin-bottom: 0px;
  line-height: 1;
}
 
`
const columns = [
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        align: 'center'
    },
    {
        title: '充电电量(kwh)',
        children: [
             {
                title: '尖',
                dataIndex: 'chargeE1',
                key: 'chargeE1',
                align: 'center'
             },
             {
                title: '峰',
                dataIndex: 'chargeE2',
                key: 'chargeE2',
                align: 'center'
             },
             {
                title: '平',
                dataIndex: 'chargeE3',
                key: 'chargeE3',
                align: 'center'
             },
             {
                title: '谷',
                dataIndex: 'chargeE4',
                key: 'chargeE4',
                align: 'center'
             }
        ]
    },
    {
        title: '充电成本(元)',
        children: [
             {
                title: '尖',
                dataIndex: 'chargeCost1',
                key: 'chargeCost1',
                align: 'center'
             },
             {
                title: '峰',
                dataIndex: 'chargeCost2',
                key: 'chargeCost2',
                align: 'center'
             },
             {
                title: '平',
                dataIndex: 'chargeCost3',
                key: 'chargeCost3',
                align: 'center'
             },
             {
                title: '谷',
                dataIndex: 'chargeCost4',
                key: 'chargeCost4',
                align: 'center'
             }
        ]
    },
   
    {
        title: '放电电量(kwh)',
        children: [
             {
                title: '尖',
                dataIndex: 'disChargeE1',
                key: 'disChargeE1',
                align: 'center'
             },
             {
                title: '峰',
                dataIndex: 'disChargeE2',
                key: 'disChargeE2',
                align: 'center'
             },
             {
                title: '平',
                dataIndex: 'disChargeE3',
                key: 'disChargeE3',
                align: 'center'
             },
             {
                title: '谷',
                dataIndex: 'disChargeE4',
                key: 'disChargeE4',
                align: 'center'
             }
        ]
    },
    {
        title: '放电收益(元)',
        children: [
             {
                title: '尖',
                dataIndex: 'disChargeIncome1',
                key: 'disChargeIncome1',
                align: 'center'
             },
             {
                title: '峰',
                dataIndex: 'disChargeIncome2',
                key: 'disChargeIncome2',
                align: 'center'
             },
             {
                title: '平',
                dataIndex: 'disChargeIncome3',
                key: 'disChargeIncome3',
                align: 'center'
             },
             {
                title: '谷',
                dataIndex: 'disChargeIncome4',
                key: 'disChargeIncome4',
                align: 'center'
             }
        ]
    },
    {
        title: <div><p>实际收益（元）</p><p>放电成本+充电成本</p></div>,
        dataIndex: 'income',
        key: 'income',
        align: 'center'

    }
   ]
const titles = ['告警总数', '今日新增告警', '一级告警', '二级告警', '三级告警', 'PCS告警', 'BMS告警', '消防告警', '环境告警']
 function Main({projectId, areaId }) {
   const [statistics ,setStatistics] = useState([])
   const [tableData, setTableData] = useState([])
   const startime = '2023-03-03'
   const endtime = '2023-03-23'
   const [dates, setDates] = useState([moment(startime, 'YYYY-MM-DD'), moment(endtime, 'YYYY-MM-DD')])
   const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })
  const getData = async() => {
    try {
        let {success, data} = await StorageAlarmruntime.AlarmStatistics(projectId, areaId)
        console.log(Object.keys(data))
        console.log(Object.values(data))
        success && setStatistics([...Object.values(data)])
        !success && setStatistics([])
    } catch (error) {
        console.log(error)
    }
   
  } 
 const timechange = (data, dateStrings) => { 
     setDates([...data])
 }
  const params = {
    start: '',
    end: '',
    projectId,
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
  }
 
  const QueryReports = async() => {   
    try {
        let [start, end] = dates;
        if ( start instanceof moment) {
            
            params.start = start.format('YYYY-MM-DD')
        }
        if (end instanceof moment) {
            params.end = end.format('YYYY-MM-DD')
        }
        let {success, data, total} = await StorageAlarmruntime.QueryStorageAlarmByPage(params, areaId)
        if (success && Array.isArray(data) && data.length >0) {
           
           setTableData([...data])   
           setPagination({...pagination, total: total})
        } else {
            setTableData([])
            setPagination({...pagination, total: 0})
        }
    } catch (error) {
        console.log(error)
    }
   
  }
  const rest = () => {
    params.end = endtime;
    params.start = startime;
    QueryReports();
  }
  const tableOnchange = (e) => { 
    let {current} = e
      setPagination({
        ...pagination,
        current,
      })
   
  }
  useEffect(() => {
    QueryReports()
  }, [])
  useEffect(() => {
    getData()
    QueryReports()
  }, [areaId])
 
  return (
    <Mainbox>
      <div className='items'>
           {
            statistics.map((s, index) => {
              console.log(s)
              return <div className={index > 4 ? 'item small' : 'item'}>
              <Image src={imgurl.gas} preview={false} height={48} width={48}></Image>
              <div className='info'>
                 <P ellipsis={{tooltip: titles[index]}} style={{fontSize: '16px'}}>{titles[index]}</P>
                 <P ellipsis={{tooltip: s}} strong style={{fontSize: '28px'}}>{s}</P>
              </div>
            </div>})
           }
      </div>
    <Titlelayout title="最新告警" layout="flex" >
    <div className='content'>
        <div className='top'>
          <Space size={16}><RangePicker value={dates} onChange={timechange}  format="YYYY-MM-DD" style={{width: '320px'}}/><Button onClick={QueryReports}>查询</Button><Button onClick={rest}>重置</Button></Space>
          
        </div>
         <Divider style={{margin: '0px'}}/>
        <Usetable columns={columns} dataSource={tableData} rowKey={nanoid()} pagination={pagination} onChange={tableOnchange} />
      
    </div>
    </Titlelayout>
    </Mainbox>
  )
}
export default function Index(props) {
    return (
        <Main {...props}     />
    )
}