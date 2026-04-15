import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space,  Input, Select, DatePicker,  Divider } from 'antd'
import {useAntdTable} from 'ahooks'
import {nanoid} from "@reduxjs/toolkit"
import dayjs from 'dayjs'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import {StorageAlarmRuntime} from '@api/api'
import imgurl from './icon'
import {  ExportExcel} from '@com/useButton'
import Pagecount from "@com/pagecontent";
import {  useOutletContext} from 'react-router-dom'
import {Mainbox} from './style'
import {columns,useStorageType} from './data'
 
const {Text, Link, Title, Paragraph} = Typography
const {Item} = Form



const P = styled(Paragraph)`
&& {
  margin-bottom: 0px;
  line-height: 1;
  font-size: 18px;
  color:#666;
}
 
`

 export default   function Index() {
  let {exparams} = useOutletContext()
  console.log(exparams);
  let {stationName,  projectId, areaId,definerangedate} = exparams
  
   const [form] = Form.useForm()
   const [statistics ,setStatistics] = useState({})
   const [total, setTotal] = useState(0)
   const options = useStorageType(projectId)
    const getData = async() => {
   
    try {
        let params ={
          projectId,
          areaId,
          siteId: stationName?.value,
          startDate: definerangedate?.[0].format('YYYY-MM-DD'),
          endDate: definerangedate?.[1].format('YYYY-MM-DD'),
        }
        let {success, data} = await StorageAlarmRuntime.alarmStatistic(params)        
        success && setStatistics({...data})
        !success && setStatistics({})
    } catch (error) {
        console.log(error)
    }
   
  } 
 
 
  const QueryReports =  ({current, pageSize}, form) => {  
     const condition =  Number.isInteger(projectId) && Number.isInteger(areaId) && stationName?.value && definerangedate?.[0] && definerangedate?.[1] 
    if(!condition) return;
    
    
    let params = {
      pageNum: current,
      pageSize,
      startDate: definerangedate?.[0].format('YYYY-MM-DD'),
      endDate: definerangedate?.[1].format('YYYY-MM-DD'),
      projectId,
      areaId,
      siteId: stationName?.value,
      ...form
    }
    return StorageAlarmRuntime.QueryStorageAlarmByPage(params).then(res => {
      let {success, data, total} = res
      setTotal(total)
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
    }).catch(e => {
      console.log(e)
    })
   
  }
  const {tableProps, search,  params} = useAntdTable(QueryReports, {
    form,
    defaultParams: [{pageSize: 14, pageNum: 1}, {
      startDate:  definerangedate?.[0]?.format('YYYY-MM-DD'),
      endDate: definerangedate?.[1]?.format('YYYY-MM-DD'),
      projectId, 
      areaId,
      siteId: stationName?.value,
      content : "",
      deviceType: 0,
      level: 0

    }],
    refreshDeps: [projectId, areaId, stationName, definerangedate],
    manual: false,
    debounceWait:500
  })
  
  const {submit} = search
  const tbref = useRef()
   
  const onExport =useCallback(() => {   
     let formData = form.getFieldsValue()
     return  QueryReports({current: 1, pageSize: total}, formData)
  }, [total])
 
  useEffect(() => {
    const condition =  Number.isInteger(projectId) && Number.isInteger(areaId) && stationName?.value && definerangedate?.[0] && definerangedate?.[1]
    if(condition) {
      getData() 
    }
  
  }, [stationName,  projectId, areaId,definerangedate])
 
 
  return (
    <Pagecount   pd="0px" bgcolor="transparent">  
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
          time: [dayjs().subtract(7, 'day'), dayjs()]
        }}>
          <Space size={16}>
             <Item label="告警查询" name="content">
              <Input placeholder='告警内容/设备名称'  onChange={submit} />
             </Item>
             <Item label="设备类型" name="deviceType">
              <Select options={options}
              fieldNames={{label: 'value', value: 'key'}}
              style={{width: '200px'}}
              onChange={submit}
              ></Select>
             </Item>
             <Item label="告警等级" name="level">
              <Select options={[
                {label: '全部告警', value: 0},
                {label: '一级告警', value: 1},
                {label: '二级告警', value: 2},
                {label: '三级告警', value: 3},
              ]}
              style={{width: '112px'}}
              onChange={submit}
              ></Select>
             </Item>
           </Space>
           <Item noStyle>
             {/*  <Button onClick={onExport} type="primary">导出</Button> */}

              <ExportExcel tb={tbref} />
           </Item>
        </Form>
        <Usetable columns={columns} ref={tbref} {...tableProps}   rowKey={nanoid()} hbg="#f0f9ff" hbc="#515151"  sheetName="告警信息" onExport={onExport} />
      
    </div>
    </Titlelayout>
    </Mainbox>
    </Pagecount>
  )
}
