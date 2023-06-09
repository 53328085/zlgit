import React, { useState, useRef, useEffect, Fragment, useCallback } from 'react'
import styled from 'styled-components'
import { Space,  DatePicker,Tag, Divider, Form,  } from 'antd'
import {nanoid} from "@reduxjs/toolkit"
import moment from 'moment'
import Usetable from '@com/useTable'
import {StorageRevenueRuntime} from '@api/api'
import {useAntdTable} from 'ahooks'
import {  ExportExcel} from '@com/useButton'
const { RangePicker } = DatePicker;

const HeaderTitle = styled.div`
  padding-left: 16px;
  height: 32px;
  line-height: 32px;
  border-left: 4px solid #237ae4;
  font-size: 16px;
  color: #333;
`
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
            tr:first-of-type {
              th:nth-of-type(1) {
                background-color: #237ae4;
                color: #fff;
              }
              th:nth-of-type(2), th:nth-of-type(3){
                background-color: #56b653;
                color: #fff;
              }
              th:nth-of-type(4), th:nth-of-type(5){
                background-color: #4370ff;
                color: #fff;
              }
              th:nth-of-type(6){
                background-color: #9951fe;
                color: #fff;
              }
            }
            tr:last-of-type {
              th:nth-of-type(1),
              th:nth-of-type(2),
              th:nth-of-type(3),
              th:nth-of-type(4),
              th:nth-of-type(5),
              th:nth-of-type(6),
              th:nth-of-type(7),
              th:nth-of-type(8) {
                background-color: #56b653;
                color: #fff;
              }
              th:nth-of-type(9),
              th:nth-of-type(10),
              th:nth-of-type(11),
              th:nth-of-type(12),
              th:nth-of-type(13),
              th:nth-of-type(14),
              th:nth-of-type(15),
              th:nth-of-type(16) {
                background-color: #4370ff;
                color: #fff;
              }
            }
        }
       }

`
const CustomTag = styled(Tag)`
  color: #515151;
  font-size: 14px;
  width: 128px;
  line-height: 32px;
`
 
const columns = [
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        width: '186px'
    },
    {
        title: '充电电量(kwh)',
        dataIndex: 'charge',
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
        dataIndex: 'chargeCost',
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
        dataIndex: 'discharge',
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
        dataIndex: 'dischargeCost',
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
        title: <div><p>实际收益（元）</p><p>放电成本-充电成本</p></div>,
        dataIndex: 'income',
        key: 'income',
        align: 'center'

    }
   ]
 
 function Main({projectId, areaId, stationName }) {
   const tableRef = useRef()
   const [price ,setPrice] = useState({})
   const {Item} = Form
   const [form] = Form.useForm()
   const [keycode, setKeycode] = useState(0)
   const [total, setTotal] = useState(0)
  const getPrice = async() => {
    try {
        let {success, data} = await StorageRevenueRuntime.QueryPrice(projectId, areaId)
        success && setPrice({...data})
        !success && setPrice({})
    } catch (error) {
        console.log(error)
    }
   
  }   
  const QueryReports = ({current, pageSize}, form) => {
    if(!stationName) return
    let {date} = form
    let params = {
      start: date[0].format('YYYY-MM-DD'),
      end: date[1].format('YYYY-MM-DD'),
      projectId,
      pageNum: current,
      pageSize,
    }
    return StorageRevenueRuntime.QueryRevenueReports(stationName, params).then(res => {
        let {success, data, total} = res
        setTotal(total)
        if(success && Array.isArray(data)) {
          return {
            list: data,
            total,
          }
        }else {
          return {
            list: [],
            total: 0
          }
        }
    })
  }
 let {tableProps, search} = useAntdTable(QueryReports, {
  form,
  defaultPageSize: 14,
  defaultParams: {
    start:moment().subtract(7, 'day').format('YYYY-MM-DD'), 
    end: moment().format('YYYY-MM-DD'),
  },
  refreshDeps: [projectId, stationName]
 })
 const {submit} = search
  const exportData = () => {
    tableRef.current.download()
  };

 
  useEffect(() => {
   if(projectId && areaId) {
     getPrice()
   }
  }, [projectId, areaId])

  
   

const onExport = useCallback(() => {
    let formData = form.getFieldsValue()
    return  QueryReports({current: 1, pageSize: total}, formData)
}, [total])
useEffect(() => {
  if (keycode < 1) return;
  if (keycode == 1)  {
    tableRef.current.download()
  }else if(keycode == 2) {
    tableRef.current.downloadAll()
  }
},[keycode])

  return (
    <Fragment>
      <HeaderTitle>收益统计</HeaderTitle>
      <Mainbox>
          <Form form={form} className='top' initialValues={{date: [moment().subtract(7, 'day'), moment()]}}>
            <Space size={16}>
              <Item label="统计时间" name="date">
                 <RangePicker   onCalendarChange={submit} format="YYYY-MM-DD" style={{width: '320px'}}/>
              </Item>
            </Space>
            <Space>
              <CustomTag>尖电价： {price.price1}</CustomTag>
              <CustomTag>峰电价： {price.price2}</CustomTag>
              <CustomTag>平电价： {price.price3}</CustomTag>
              <CustomTag>谷电价： {price.price4}</CustomTag>
              <Divider style={{height: 32}} dashed type={'vertical'}/>
           {/*    <Button type='primary' style={{width: 96}} onClick={()=>exportData()}>导出</Button> */}
              <ExportExcel style={{marginLeft: 'auto'}} setKey={setKeycode} />
            </Space>
            
          </Form>
          <Divider style={{margin: '0px'}}/>
          <Usetable ref={tableRef} columns={columns}   rowKey={nanoid()}  {...tableProps} onExport={onExport} sheetName='收益统计.xlsx'/>
      </Mainbox>
    </Fragment>
  )
}
export default function Index(props) {
    return (
        <Main {...props}     />
    )
}