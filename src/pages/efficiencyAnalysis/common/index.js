import React, {useEffect, useMemo} from 'react'
import moment from 'moment'
import {useTranslation} from "react-i18next"
import {Form, Select, Space, DatePicker, ConfigProvider} from 'antd'
import enUS from 'antd/lib/calendar/locale/en_US'
import  {Cform} from "@com/useSerach/comhead.js"
const  dateType=[
  {
      value:1,
      label: "Day"
  },
  {
      value:2,
      label: "Month"
  },
  {
      value:3,
      label: "Year"
  },
  {
      value:4,
      label: "Custon"
  }
];
  const disabledDate = (current) => { 
    return  (current && current> moment().endOf("day"));
  };
const w200 = { width: 200 }
const w88 = { width: 88 }
export default function Index() {
  const [form]=Form.useForm()
  const {i18n}=useTranslation()
  useEffect(()=>{
     i18n.changeLanguage("en")
     return () => {
       i18n.changeLanguage("zh")
     }
  },[])
  return (
    <ConfigProvider locale={enUS}>
   <Cform form={form} layout="inline" initialValues={{ areaId: 1, type: 1 }}>
    <Space size={16}>
     <Form.Item name="areaId" label="Park selection">
      <Select options={[{value:1,label:"Sanofi( HangZhou)"}]} style={w200}></Select>
     </Form.Item>
     <Form.Item name="type">
      <Select options={dateType} style={w88}></Select>
     </Form.Item>
     <Form.Item noStyle shouldUpdate={(cur, pre) => cur.type != pre.type}>
      {
        ({ getFieldValue}) => {
          let type = getFieldValue("type")
          console.log("type", type)
          const picker = { "1": "date", "2": "month", "3": "year" }[type?.toString()]
          if (type == 4) {
            return <Form.Item name="date" initialValue={[moment().startOf("day"), moment().endOf("day")]}  >
              <DatePicker.RangePicker disabledDate={disabledDate} format="DD/MM/YYYY"  style={w200} />
            </Form.Item>
          } else {
            return <Form.Item name="date" initialValue={moment()}>
              <DatePicker picker={picker}  disabledDate={disabledDate} style={w200} />
            </Form.Item>
          }
        }
      }
    </Form.Item>
     </Space>
   </Cform>
   </ConfigProvider>
  )
}
export function useGauge({data,radius="100px", center=['50%', 110]}){
  const  goption =useMemo(()=>{
     const  series={
       type:5,
       series: [
       {
         type: 'gauge',
         radius,
         center ,
         startAngle:180,
         endAngle:0,
         axisLine: {
           lineStyle: {
             width: 18,
             color: [
               [0.6, 'rgba(5, 192, 110, 1)'],
               [0.7, 'rgba(255, 177, 43, 1)'],
               [1, 'rgba(255, 96, 33, 1)']
             ],
             opacity: 0.8
           }
         },
         pointer: {
           offsetCenter: [0, '-10%'],
           width: 5,
           itemStyle: {
             color: 'auto'
           }
         },
         axisTick: {
           distance: -18,
           length: 8,
           lineStyle: {
             color: '#fff',
             width: 1
           }
         },
         anchor: {
           show: false
         },
         splitLine: {
           show: false
         },
         axisLabel: {
           show: true,
           color: 'auto',
           distance: 5,
           fontStyle: "bold",
           fontSize: 13,
           formatter: function (value) { 
             console.log(value)
             if(value==60) {
               return 0.60;
             }else if(value==70) {
               return 0.70;
             }else {
               return  ''
             }
           }
         },
         detail: {
           valueAnimation: true, 
           color: 'rgba(96, 98, 102, 1)',
           fontSize: 20,
           offsetCenter: [0, "-30%"]
         },
         data: [
           {
             value: data || 0
           }
         ]
       }
     ]}
     return series
  }, [data,radius]) 
  
 return goption
}