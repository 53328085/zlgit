import { Button, Modal, Space, Input } from 'antd';
import styled from 'styled-components';
import React, { createContext, useEffect, useRef, useState } from 'react';
import {useSearchParams, useLocation, useNavigate} from 'react-router-dom'
import { textSpanContainsTextSpan } from 'typescript';
const ReachableContext = createContext(null);
const Flexbox = styled.div`
&& {
  display: flex;
  flex-flow: column wrap;
  height: 600px;
  align-content: stretch;
  row-gap: 16px;
  .item {
    flex: 1 1 300px;
    margin-right: 16px;
    border: 1px solid #dedede;
  }
}
`
const App = () => {
  
  const texts =[
    "把 flex 容器的属性",
    "flex-direction 改为 column，",
    "主轴和交叉轴交换，元素沿着列的方向排列显示。",
    "改为 column-reverse，起始线和终止线交换。",
   "到现在为止，我们已经对定义在",
   " flex 容器里的 flex 项目或者单个 flex 项目进行对齐",
   "操作了。如果你有一个折行的多条 flex 项目的 flex 容器，",
   "然后你可能想使用 align-content 来控制每行之间空间的分配，在这种特定的场景叫做packing flex lines",
   "把 flex 容器的属性",
   "flex-direction 改为 column，",
   "主轴和交叉轴交换，元素沿着列的方向排列显示。",
   "改为 column-reverse，起始线和终止线交换。",
  "到现在为止，我们已经对定义在",
  " flex 容器里的 flex 项目或者单个 flex 项目进行对齐",
  "操作了。如果你有一个折行的多条 flex 项目的 flex 容器，",
  "然后你可能想使用 align-content 来控制每行之间空间的分配，在这种特定的场景叫做packing flex lines"
  ]
 
  return (
    <div>
      <Flexbox>{
        texts.map(t => <div className='item'>{t}</div>)
}</Flexbox>
    </div>
  )
};
export default App;