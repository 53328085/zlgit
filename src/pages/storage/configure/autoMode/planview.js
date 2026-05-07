import React, {useState, useMemo,useCallback} from 'react'
import dayjs from 'dayjs'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker,   Descriptions, Divider, Checkbox, message } from 'antd'
import {useSelector} from "react-redux"
import { themeColor,adaptation  } from '@redux/systemconfig.js'
import {CustCalendar, Viewbox,Sblock} from './style'
import Titlelayout from '@com/titlelayout'
 const getminutes = (end, start) => dayjs(end, 'hh:mm').diff(dayjs(start, 'hh:mm'), 'minutes')  
 const  indexes= Array.from({length: 96}, (v, i) => ({index: i+1, type: 3})) 
  const hours = Array.from({length: 13}, (v, i) => (i*2)>=10 ? (2*i).toString() : 0+(2*i).toString())
 const getvalidate = (start, end, type, choosedate) => {
     
 
     let dayslist = enumerateDaysBetweenDates(start, end)
     if(type == 1) return dayslist
     if(type == 2) {
       return  dayslist.filter(d => choosedate?.includes?.(dayjs(d, 'YYYY-MM-DD').day())) // 每周
     }
     if(type == 3) {
       return dayslist.filter(d => choosedate?.includes?.(dayjs(d, 'YYYY-MM-DD').date()))
     }
 
 }
 const  enumerateDaysBetweenDates = (startDate, endDate) => {  
     let daysList = [];
     let SDate=dayjs(startDate,"YYYY-MM-DD");
     let EDate=dayjs(endDate,"yyyy-MM-DD");
      
     daysList.push(SDate.format('YYYY-MM-DD'));
    /*  while( SDate.add(1,"day").diff(EDate,'day')>0 ){   
         daysList.push( SDate.format('YYYY-MM-DD'));
     } */ 
     daysList.push( EDate.format('YYYY-MM-DD'));
     return daysList;
   }
 export default function Index ({data, strategyDetail}){ // status 1, 充电， 2， 放 3 待机 4. 停机
     let {laptop} = useSelector(adaptation)
     let {name, strategyName,priority, executionCycle,  startDate, endDate, dateChoose} = data
    
     let {primaryderived,primaryColor} = useSelector(themeColor)
      
/*      const items = useMemo(()=>{
        if(Array.isArray(strategyName) && strategyName.length > 0) {
          let status = strategyDetail?.map?.(s => ({start: getminutes(s.start, '00:00') / 15, end: getminutes(s.end, '00:00') / 15, type: s.status}) )  
             status?.forEach?.(s => {
                indexes.forEach(i => {
                    if(i.index >s.start && i.index <=s.end) {
                        i.type = s.type
                    }
                })
            });
            return indexes
        }
        return []

     }, [strategyDetail])   */ 

 
    
    
     const datalist = useMemo(() =>  getvalidate(startDate, endDate, executionCycle, dateChoose) 
      , [executionCycle, startDate, endDate, dateChoose])
     console.log('datalist', datalist)
     const dateCellRender = useCallback((value) => {
         
         let time = dayjs(value).format('YYYY-MM-DD')
          
         let date = value.date()
         let issome = dayjs(value).isSame(dayjs(), 'day')
         return (
           datalist?.includes?.(time) ?  <Datebox bg={issome && datalist?.includes?.(time) ? '#f0f9ff' : 'none'} key={nanoid()}>
             <span >{date}日</span>
             <span className='el'>{name}</span>
             </Datebox> : <Datebox bg='none' key={nanoid()}>
             <span >{date}日</span>
             <span className='el'>&nbsp;</span>
             </Datebox>
         )
     }, [name, datalist])
      
     return (
         <Titlelayout  title={<div style={{height: '32px', backgroundColor: primaryderived, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}></div>} bordered={'n'} layout="flex" pv="0px" bl="none" pl="0px">
             <Viewbox>               
                 <div className='detl'>
                    <div style={{color: '#999', height: '48px'}}>查看运行计划及具体内容</div>
                    <div style={{border: '1px solid #d7d7d7', flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <div className='title'>计划详细</div>
                    <div className='content'>
                     {/*   <Descriptions  bordered column={3} size="small"   styles={{
                         content:{color:primaryColor},
                         label:{width: '72px',padding: '2px', textAlign: 'center'}
                         }}>
                         <Descriptions.Item label="计划名称">{name}</Descriptions.Item>
                         <Descriptions.Item label="策略模板">{strategyName}</Descriptions.Item>
                         <Descriptions.Item label="优先级">{priority}</Descriptions.Item>
                        </Descriptions> */}
                        <Divider style={{margin: '0px'}}/>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                      {/*   <div className='list'>
                          {items.map(i => <Itembox type={i.type} key={nanoid()} />)}
                        </div>
                         <div className='num'>
                             {hours.map(i => <span>{i}</span>)}
                         </div> */}
                       {/*   <div className='dstrategy'  >
                              {
                                 strategyDetail?.map?.(s => <div className='dsitme' key={nanoid()}>
                                     <span>{s.start}-{s.end}</span>
                                     <span>{s.statusStr}</span>
                                     <span>{s.planP}kw</span>
                                 </div>)
                              }
                         </div> */}
                         <Space size={32} style={{marginLeft: laptop? '0px' : '-16px'}}>
                            <div style={{fontSize: '12px', display: 'flex',alignItems: 'center'}}><Sblock bg='#4370ff'   />充电</div>
                            <div style={{fontSize: '12px', display: 'flex',alignItems: 'center'}}><Sblock bg='#ff9933' />放电</div> 
                            <div style={{fontSize: '12px', display: 'flex',alignItems: 'center'}}><Sblock bg='#0dc6d1' />待机</div> 
                            <div style={{fontSize: '12px', display: 'flex',alignItems: 'center'}}><Sblock bg='#333' />停机</div> 
                         </Space>
                        </div>
                    </div>
                    </div>
                 </div>
                
               {/*   <CustCalendar fullscreen={false} fullCellRender={dateCellRender}  />  */}
               {/*  <CustCalendar fullscreen={false}   /> */}
               
             </Viewbox>
         </Titlelayout>
     )
 }






