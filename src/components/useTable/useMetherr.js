
import { useState, useEffect } from 'react';

export   function useGetY(){
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const calculateHeight = () => {
      // 1. 获取表格的表头元素
      const tableHeader = document.querySelector('.ant-table-thead');
      if (!tableHeader) return;

      // 2. 计算表头距离视口顶部的距离
      console.log(tableHeader.getBoundingClientRect())
      const headerTop = tableHeader.getBoundingClientRect().top;

      // 3. 计算可用高度：窗口高度 - 表头顶部距离 - 底部额外高度(如分页器)
      const extraHeight = 16; // 底部元素的高度
      const height = window.innerHeight - headerTop - extraHeight;
      
      setScrollY(height);
    };

    // 页面加载完成后计算一次
    calculateHeight();
    
    // 监听窗口大小变化，实时更新
    window.addEventListener('resize', calculateHeight);

    // 组件卸载时清理事件监听
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  return scrollY;
};