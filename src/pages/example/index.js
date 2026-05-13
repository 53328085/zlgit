/* import React, { useState, useEffect, useRef } from 'react';
import { List } from 'antd';

const InfiniteScrollList = ({ data }) => {
  // 1. 复制数据以实现无缝衔接
  const [displayData, setDisplayData] = useState([...data, ...data]);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 计算单份数据的高度
    const singleListHeight = container.scrollHeight / 2;
    
    // 2. 定义动画逻辑
    const animate = () => {
      // 瞬间重置位置到顶部
      container.style.transition = 'none';
      container.style.transform = 'translateY(0)';
      
      // 强制重绘后开始动画
      requestAnimationFrame(() => {
        container.style.transition = 'transform 10s linear'; // 10s 滚动一圈
        container.style.transform = `translateY(-${singleListHeight}px)`;
      });
    };

    // 3. 监听动画结束，重置位置
    const handleTransitionEnd = () => {
      // 当动画结束（滚到了复制的那份数据底部），立即重置
      animate();
    };

    container.addEventListener('transitionend', handleTransitionEnd);
    
    // 启动动画
    animate();

    return () => {
      container.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, []);

  return (
    <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
      <div ref={containerRef}>
        <List
          dataSource={displayData}
          renderItem={(item) => (
            <List.Item style={{ padding: '10px 0' }}>
              {item}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

// 使用示例
const App = () => {
  const mockData = ['新闻 1', '新闻 2', '新闻 3', '新闻 4', '新闻 5'];
  return <InfiniteScrollList data={mockData} />;
};

export default App; */


import React, {useState} from 'react';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

 
const disabledRangeTime = (day, type) => {
  console.log(day?.format?.('HH:mm'), type)
 
 
};
const App = () => {
   const [dates, setDates] = useState([]);
     const onCalendarChange = (v)=> {
    console.log("onCalendarChange",v)
    setDates(v)
  }
    const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };
  const disabledDate = (current,{from,type}) => {
    console.log("form",from?.format("YYYY-MM-DD"))
    console.log("current",current?.format("YYYY-MM-DD)"))
    console.log("dates",dates)
     if(from) {
       return (current && from.diff(dates[0], "day") >1) ||  (current&& current > dayjs().endOf('day'));
     }
      
     return current && current > dayjs().endOf('day');
   
   
}; 
  return (
  <Space direction="vertical" size={12}>
    
    <RangePicker
      value={dates}
      disabledDate={disabledDate}
      disabledTime={disabledRangeTime}
       onCalendarChange={onCalendarChange}
       defaultPickerValue={dates}
      showTime={{
        hideDisabledOptions: true,
        defaultOpenValue: [dayjs('00:00', 'HH:mm'), dayjs('11:59', 'HH:mm')],
      }}
    //  onOpenChange={onOpenChange} 
      format="YYYY-MM-DD HH:mm"
    />
  </Space>
)};
export default App;