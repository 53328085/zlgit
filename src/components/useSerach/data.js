import { DatePicker } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
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

export const Daterange = ({value, onChange,rangeDate}) => {
  const [dates, setDates] = useState(null);
  
  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    
    const tooLate = dates[0] && current.diff(dates[0], 'days') > rangeDate;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > rangeDate;
    return !!tooEarly || !!tooLate || (current && current> moment().endOf("day"));
  };
  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };
 
  const onCalendarChange = (v)=> {
    console.log("onCalendarChange")
    setDates(v)
  }
  return (
    <RangePicker
      value={dates || value}
      disabledDate={disabledDate}
      onCalendarChange={onCalendarChange}
      onChange={onChange}
      onOpenChange={onOpenChange} 
    />
  );
};
 