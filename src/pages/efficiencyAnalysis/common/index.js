import React, {useEffect} from 'react'
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
