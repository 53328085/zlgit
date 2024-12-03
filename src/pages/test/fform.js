import React from 'react';
import { Responsive as ResponsiveGridLayout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Titlelayout from '@com/titlelayout';
const ResponsiveReactGridLayout = WidthProvider(ResponsiveGridLayout);

const layouts = {
  lg: [
    { i: 'a', x: 0, y: 0, w: 2, h: 2 },
    { i: 'b', x: 2, y: 0, w: 4, h: 2 },
    { i: 'c', x: 4, y: 0, w: 6, h: 2 },
    { i: 'd', x: 6, y: 0, w: 8, h: 2 },
  ],
  md: [
     
  ],
  // 其他断点布局配置...
};

const breakpoints = {
  lg: 1536, // 
  md: 1024,
  
};

const MyResponsiveGrid = () => (
  <ResponsiveReactGridLayout
    className="global_dashboard_layout"
    layouts={layouts}
    breakpoints={breakpoints}
    cols={{ lg: 8, md: 4 }}
    rowHeight={200}
    isDraggable={true}
    isResizable={true}
  >
    <div key="a">A</div>
    <div key="b">B</div>
    <div key="c">C</div>
   
  </ResponsiveReactGridLayout>
);

export default MyResponsiveGrid;