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

 export const onedateType=[
    {
        value:1,
        label: "日"
    },   
    {
        value:4,
        label: "自定义"
    }
]
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
const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
const minutes = [0,15, 30, 45]
export const Onedaterange = ({value, onChange,showTime=false, update}) => {
  const [dates, setDates] = useState(null);
  console.log("Daterange", dates)
  //console.log("Daterange", rangeDate)
  const disabledDate =useCallback((current, {from}) => {
    if (!dates) {
      return false;
    }
  //  console.log("dates", dates)
    let  tooLate;
      if(dates[0]){
      
      // tooEarly = dates[0] && current.diff(dates[0], 'day') > 1
      tooLate = dates[0] && Math.abs(current.diff(dates[0], 'hour')) > 24 ;
      }
     // const tooLate = dates[0] && current.diff(dates[0], 'day') > 1;
     console.log("tooLate",tooLate)
      return !!tooLate  ||  (current && current> day().endOf("day"));
     
   
  },[dates]);
  const disabledRangeTime=useCallback((current, type,{from})=>{
    try {
            if (!dates) {
        return {};
      }
    if (type=== 'end' && from) {
      let h = from.hour()
      let m= from.minute()
      let index = minutes.indexOf(parseInt(m))
      let  isDay = current.isSame(from, 'day') // 是否同一天
     
      return { 
        disabledHours: isDay ? () => range(0, 24).splice(0, h+1) :() => range(0, 24).splice(h+1, 24), 
      }
    }
    return {}
      
    } catch (error) {
      console.log(error)
      return {}
    }

    
  },[dates])
  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };
 
  const onCalendarChange = (v)=> {
  //  console.log("onCalendarChange",v)
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
      disabledTime={disabledRangeTime}
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