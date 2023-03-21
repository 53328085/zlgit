import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions,Tag, Divider } from 'antd'
import {CaretRightOutlined, CaretUpFilled, CaretDownFilled}  from '@ant-design/icons'
import {nanoid} from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import {StorageReportRuntime} from '@api/api'

const {Text, Link, Title, Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && {
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
        .ant-table-thead {
            tr:first-of-type th {
              background-color: #f0f9ff;
            }
            tr:last-of-type {
              th:nth-of-type(4n+1) {
                background-color: #f99;
              }
              th:nth-of-type(4n+2) {
                background-color: #fc3;
              }
              th:nth-of-type(4n+3) {
                background-color: #9f9
              }
              th:nth-of-type(4n+4) {
                background-color: #3cf;
              }
            }
        }
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
 
 function Main({projectId, areaId }) {
   const [price ,setPrice] = useState({})
   const [tableData, setTableData] = useState([])
   const startime = '2023-03-03'
   const endtime = '2023-03-23'
   const [dates, setDates] = useState([moment(startime, 'YYYY-MM-DD'), moment(endtime, 'YYYY-MM-DD')])
   const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })
  const getPrice = async() => {
    try {
        let {success, data} = await StorageReportRuntime.QueryPrice(projectId, areaId)
        success && setPrice({...price, ...data})
        !success && setPrice({})
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
        let {success, data, total} = await StorageReportRuntime.QueryReports(params, areaId)
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
    getPrice()
    QueryReports()
  }, [areaId])
 
  return (
    <Titlelayout title="报表统计" layout="flex" >
    <Mainbox>
        <div className='top'>
          <Space size={16}><RangePicker value={dates} onChange={timechange}  format="YYYY-MM-DD" style={{width: '320px'}}/><Button onClick={QueryReports}>查询</Button><Button onClick={rest}>重置</Button></Space>
          <Tag style={{lineHeight: '32px'}}>
            <Space>
            <Text>分时电价（元/kwh）</Text>
            <Text>尖电价： {price.item1}</Text>
            <Text>峰电价： {price.item2}</Text>
            <Text>平电价： {price.item3}</Text>
            <Text>谷电价： {price.item4}</Text>
            </Space>
          </Tag>
        </div>
         <Divider style={{margin: '0px'}}/>
        <Usetable columns={columns} dataSource={tableData} rowKey={nanoid()} pagination={pagination} onChange={tableOnchange} />
      
    </Mainbox>
    </Titlelayout>
  )
}
export default function Index(props) {
    return (
        <Main {...props}     />
    )
}