import { DatePicker,Form } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import day from 'dayjs';
const { RangePicker } = DatePicker;

export const publicdateType=[
    {
        value:1,
        label: "日"
    },
    {
        value:2,
        label: "月"
    },
    {
        value:3,
        label: "年"
    },
    {
        value:4,
        label: "自定义"
    }
]
export const w200 = {
  width:200
}
export const w88 = {
  width:88
}

 
export const Daterange = ({value, onChange,rangeDate=45,showTime=false, update}) => {
  const [dates, setDates] = useState(null);
  console.log("Daterange", value)
  //console.log("Daterange", rangeDate)
  const disabledDate =(current) => {
    if (!dates) {
      return false;
    }
  //  console.log("dates", dates)
      const tooLate = dates[0] && current.diff(dates[0], 'days') > rangeDate;
      const tooEarly = dates[1] && dates[1].diff(current, 'days') > rangeDate;
      return !!tooEarly || !!tooLate || (current && current> day().endOf("day"));
     
   
  };
  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };
 
  const onCalendarChange = (v)=> {
    console.log("onCalendarChange",v)
    setDates(v) 
    onChange&& onChange(v)
  }
  useEffect(()=>{ 
    onChange&& onChange(value)
    update&&update()
  },[])
  return (
    <RangePicker
      value={dates || value}
      disabledDate={disabledDate}
      onCalendarChange={onCalendarChange}
     
      onOpenChange={onOpenChange} 
      showTime={showTime}
    />
  );
};

 export const viewopt=[
  {
    label: '能耗',
    value: 1,
  },
  {
    label: '费用',
    value: 2,
  }]

 export const  DefineDateRange=(props)=>{
    return (
      <Form.Item name="definerangedate" initialValue={[day().subtract(1, "month"), day()]}  >
        <Daterange  {...props} />
      </Form.Item>
    )
 }
 export const disableDate=(current)=>{
  return current && current> day().endOf("day");
}
export const cycleTime=[
    {
        value:5,
        label: "5分钟"
    },
    {
        value:15,
        label: "15分钟"
    },
    {
        value:30,
        label: "半小时"
    },
    {
        value:60,
        label: "1小时"
    }
]