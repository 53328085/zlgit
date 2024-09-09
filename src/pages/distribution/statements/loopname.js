import React, {useRef,useState, useEffect} from 'react'
import {useOutletContext} from 'react-router-dom'
import Pagecount from '@com/pagecontent' 
import styled from 'styled-components'
import Titlelayout from '@com/titlelayout'
import CustContext from '@com/content.js'
import {useRequest} from 'ahooks'
import {Space, Typography, DatePicker} from 'antd'
 
import UseTable from '@com/useTable'
 
import {DistributionRoomRuntime} from '@api/api.js'
import moment from 'moment'
const Loopmain = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  row-gap: 16px;
`
const columns =[
    
        
       {
        title: '电压',
        children: [
            {
                title: 'Ua(v)',
                dataIndex: 'Ua',
                key: 'Ua',
               },
               {
                title: 'Ub(v)',
                dataIndex: 'Ub',
                key: 'Ub',
               },
               {
                title: 'Uc(v)',
                dataIndex: 'Uc',
                key: 'Uc',
               },
        ]
       },
       {
        title: '电流',
        children: [
            {
                title: 'Ia(v)',
                dataIndex: 'Ia',
                key: 'Ia',
               },
               {
                title: 'Ib(v)',
                dataIndex: 'Ib',
                key: 'Ib',
               },
               {
                title: 'Ic(v)',
                dataIndex: 'Ic',
                key: 'Ic',
               },
        ]
       },
       {
        title: '功率因数',
        dataIndex: 'phsA',
        key: 'phsA',
       },
       {
        title: '总有功功率',
        children: [
            {
                title: '(kW)',
                dataIndex: 'Pa',
                key: 'Pa',
               },
         ]
       },
       {
        title: '总无功功率',
        children: [
            {
                title: '(kVar)',
                dataIndex: 'Q',
                key: 'Q',
               },
         ]
       },
       {
        title: '总能耗',
        children: [
            {
                title: '(kWh)',
                dataIndex: 'EP',
                key: 'EP',
               },
         ]
       },
]
const { RangePicker } = DatePicker;
export default function Index({projectId,sn}) {
    const [value, setvalue] = useState('1')
    const [sdate, setSdate] = useState([moment().subtract(7, 'day'), moment()])
    const {setCustview} = useOutletContext()
    const tabs = [
        { key: '1', label: '电压' },
        { key: '2', label: '电流' },
        { key: '7', label: '功率因数' },
        { key: '4', label: '有功功率' },
        { key: '5', label: '无功功率' },
        { key: '6', label: '视在功率' },
       
      ]
    let dataProps = {
        value,
        setvalue,
        tabs,
      }
      const [dates, setDates] = useState(null);
      const [dvalue, setValued] = useState(null);
      const disabledDate = (current) => {
        console.log(dates)
       // console.log(dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD"))
        if (!dates) {
          return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') < 7;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
        return !!tooEarly || !!tooLate;
      };
      const onOpenChange = (open) => {
        if (open) {
          setDates([null, null]);
        } else {
          setDates(null);
        }
      };
   
  const custview = (
    <RangePicker
    value={dates || dvalue}
    disabledDate={disabledDate}
    onCalendarChange={(val) => setDates(val)}
    onChange={(val) => setValued(val)}
    onOpenChange={onOpenChange}
    onBlur={() => console.log('blur has been triggered')}
  />
  )
  const getData =async() => {
      try {
        if(!Number.isInteger(parseInt(projectId)) && !sn && !dvalue) return
         let [start, end] = dvalue
         let params ={
            projectId,
            sn,
            type: parseInt(value),
            start: start.format('yyyy-MM-DD'),
            end: end.format('yyyy-MM-DD')
         }
        let {success, data} =await DistributionRoomRuntime.HistoryTrend(params)
        if(success && Array.isArray(data)) {
          return data
        }else {
          return []
        }
      } catch (error) {
        return Promise.reject(error)
      }
  } 
  const {data, run, loading} = useRequest(getData, {
    refreshDeps: [projectId, sn, value, dates,dvalue]
  })
 
  useEffect(() => {
    setCustview(custview)
    return () => {
        setCustview(null)
    }
  }, [])
 
 
  return (
    <Loopmain>
          <CustContext.Provider value={dataProps} >
    
    <Pagecount>
      
    </Pagecount>
   
   </CustContext.Provider>
       <UseTable columns={columns} dataSource={[]} loading={loading}
       hbg="#ecf5ff"
       hbc="#515151"
      
       scroll={{
                    scrollToFirstRowOnChange: true, 
                     y: 550
                   }
                  }></UseTable>
    
     </Loopmain>
  )
}
