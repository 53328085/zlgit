import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions,Tag, Divider } from 'antd'
import {useAntdTable} from 'ahooks'
import {nanoid} from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import {StorageAlarmRuntime} from '@api/api'
import imgurl from './icon'
const {Text, Link, Title, Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && {
      display: grid;
      grid-template-rows: 64px 1fr;
      row-gap: 16px;
      flex: 1;
      .items {
         display: grid;
         grid-template-columns: repeat(4, 320px);
         grid-template-rows: 64px;
         column-gap: 16px;
        .item {
          width: 320px;
          height: 64px;
          background-color: rgba(255, 255, 255, 1); 
          border: 1px solid rgba(215, 215, 215, 1); 
          border-radius: 4px; 
          box-shadow: none;
          padding:  8px 12px;
          display: grid;
          grid-template-columns: 48px 1fr;
          align-items: center;
          justify-items: center;
          column-gap: 22px;
          .info { 
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;;
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
        .ant-table-thead {
            tr:first-of-type th {
              background-color: #f0f9ff;
            }
        }
      }
       
       }

`
const P = styled(Paragraph)`
&& {
  margin-bottom: 0px;
  line-height: 1;
  font-size: 18px;
  color:#666;
}
 
`
const columns = [
    {
        title: '告警时间',
        dataIndex: 'warningTime',
        key: 'warningTime',
        align: 'center'
    },
    {
        title: '告警描述',
        dataIndex: 'alarmEvent',
        key: 'alarmEvent',
        align: 'center'
    },
    {
      title: '告警等级',
      dataIndex: 'level',
      key: 'level',
      align: 'center'
     },
     {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
     },
    {
      title: '安装地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center'
  },
  {
    title: '设备编号',
    dataIndex: 'sn',
    key: 'sn',
    align: 'center'
},
 
   {
    title: '设备型号',
    dataIndex: 'category',
    key: 'category',
    align: 'center'
   },
  
   ]
 
 function Main({projectId, areaId, siteId }) {
   const [form] = Form.useForm()
   const [statistics ,setStatistics] = useState({})
  const getData = async() => {
   
    try {
        let {success, data} = await StorageAlarmRuntime.alarmStatistic(projectId, areaId, siteId)        
        success && setStatistics({...data})
        !success && setStatistics({})
    } catch (error) {
        console.log(error)
    }
   
  } 
 
 
  const QueryReports =  ({current, pageSize}, form) => {   
    let {time, ...rest} = form
    let start = time[0].format('YYYY-MM-DD')
    let end = time[1].format('YYYY-MM-DD')
    let params = {
      pageNum: current,
      pageSize,
      start,
      end,
      projectId,
      areaId,
      siteId,
      ...rest
    }
    return StorageAlarmRuntime.QueryStorageAlarmByPage(params).then(res => {
      let {success, data, total} = res
      if (success && Array.isArray(data) && data.length >0) {
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
    })
   
  }
  const {tableProps, search} = useAntdTable(QueryReports, {
    form,
    defaultParams: [{pageSize: 14, pageNum: 1}, {
      start: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      projectId, 
      areaId,
      siteId,
      content : "",
      deviceType: 0,
      level: 0

    }],
    refreshDeps: [projectId, areaId, siteId]
  })
  
  const {submit} = search
  const tbref = useRef()
  const onExport = () => {
    tbref.current.download()
  }
 
  useEffect(() => {
    console.log(projectId, areaId, siteId)
    if(areaId && projectId && siteId) {
      getData() 
    }
  
  }, [areaId, projectId, siteId])
 
 
  return (
    <Mainbox>
      <div className='items'>
           <div className='item'>
              <Image src={imgurl.allCn} preview={false} height={48} width={48}></Image>
              <div className='info'>
                 <P style={{fontSize: '18px'}}>告警总数</P>
                 <P ellipsis={{tooltip: statistics.allCn}} style={{fontSize: '18px'}} >{statistics.allCnt}</P>
              </div>
            </div>
            <div className='item'>
              <Image src={imgurl.levelOneCnt} preview={false} height={48} width={48}></Image>
              <div className='info'>
                 <P   style={{fontSize: '16px'}}>一级告警</P>
                 <P ellipsis={{tooltip: statistics.levelOneCnt}}    >{statistics.levelOneCnt}</P>
                 <P ellipsis={{tooltip: statistics.levelOneRate}} style={{fontSize: '14px'}} >{statistics.levelOneRate}%</P>
              </div>
            </div>
            <div className='item'>
              <Image src={imgurl.levelTwoCnt} preview={false} height={48} width={48}></Image>
              <div className='info'>
                 <P   style={{fontSize: '16px'}}>二级告警</P>
                 <P ellipsis={{tooltip: statistics.levelTwoCnt}}  >{statistics.levelTwoCnt}</P>
                 <P ellipsis={{tooltip: statistics.levelTwoRate}}  style={{fontSize: '14px'}} >{statistics.levelTwoRate}%</P>
              </div>
            </div>
            <div className='item'>
              <Image src={imgurl.levelThreeCnt} preview={false} height={48} width={48}></Image>
              <div className='info'>
                 <P   style={{fontSize: '16px'}}>三级告警</P>
                 <P ellipsis={{tooltip: statistics.levelThreeCnt}}  >{statistics.levelThreeCnt}</P>
                 <P ellipsis={{tooltip: statistics.levelThreeRate}} style={{fontSize: '14px'}} >{statistics.levelThreeRate}%</P>
              </div>
            </div>
          
      </div>
    <Titlelayout title="最新告警" layout="flex" >
    <div className='content'>
        <Form form={form} className='top' layout='inline' initialValues={{
          content: '',
          deviceType:0,
          level: 0,
          time: [moment().subtract(7, 'day'), moment()]
        }}>
          <Space size={16}>
             <Item label="告警查询" name="content">
              <Input placeholder='告警内容/设备名称' />
             </Item>
             <Divider style={{margin: '0', height: '32px'}}  type="vertical" />
             <Item label="设备类型" name="deviceType">
              <Select options={[
                {label: '全部', value: 0},
                {label: 'PCS', value: 1},
                {label: '电堆', value: 2},
                {label: '电池簇', value: 3},
                {label: '电池组', value: 4},
                {label: '储能柜空调', value: 5},
                {label: '环境温度传感器', value: 6},
                {label: '水浸传感器', value: 7},
              ]}
              style={{width: '112px'}}
              onChange={submit}
              ></Select>
             </Item>
             <Divider style={{margin: '0', height: '32px'}} type="vertical" />
             <Item label="告警等级" name="level">
              <Select options={[
                {label: '全部告警', value: 0},
                {label: '一级告警', value: 2},
                {label: '二级告警', value: 3},
                {label: '三级告警', value: 4},
              ]}
              style={{width: '112px'}}
              onChange={submit}
              ></Select>
             </Item>
             <Divider style={{margin: '0', height: '32px'}} type="vertical" />
             <Item label="告警时间" name="time" >
               <RangePicker  onChange={submit}  format="YYYY-MM-DD" style={{width: '320px'}}/>
            </Item>
           </Space>
           <Item noStyle>
              <Button onClick={onExport} type="primary">导出</Button>
           </Item>
        </Form>
        
         <Divider style={{margin: '0px'}}/>
        <Usetable columns={columns} ref={tbref} {...tableProps}   rowKey={nanoid()}   sheetName="告警信息" />
      
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