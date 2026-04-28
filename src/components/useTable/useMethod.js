
import { useState, useEffect } from 'react';

export   function useGetXY({extraHeight=52, extraWidth=16}={}){
  const [position, setPosition] = useState({});

  useEffect(() => {
    const calculateHeight = () => {
      // 1. 获取表格的表头元素
      try {
         const tableHeader = document.querySelector('.ant-table-tbody');
       //  console.log("tableHeader",tableHeader)
      if (!tableHeader) return;

      // 2. 计算表头距离视口顶部的距离
    //  console.log(tableHeader.getBoundingClientRect())
      const top = tableHeader.getBoundingClientRect().top;
      const left = tableHeader.getBoundingClientRect().left;
      // 3. 计算可用高度：窗口高度 - 表头顶部距离 - 底部额外高度(如分页器)
     // const extraHeight = 48; // 底部元素的高度
      const scrollY = window.innerHeight - top - extraHeight;
      const scrollX = window.innerWidth - left - extraWidth;
   //   console.log("point",scrollY,scrollX)
      setPosition({scrollY,scrollX });
      } catch (error) {
        console.log(error)
      }
     
    };

    // 页面加载完成后计算一次
    calculateHeight();
    
    // 监听窗口大小变化，实时更新
    window.addEventListener('resize', calculateHeight);

    // 组件卸载时清理事件监听
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  return position;
};