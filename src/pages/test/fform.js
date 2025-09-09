import React, {useState,memo} from 'react'
import {Button} from 'antd'
import RGL, {Responsive, WidthProvider} from 'react-grid-layout'
import "./drag.css"
 
const ResponsiveGridLayout=  WidthProvider(RGL)
export default function Index() {
  const layout = [
    {i: 'a', x: 0, y: 0, w: 1, h: 1, static: true},
    {i: 'b', x: 1, y: 0, w: 3, h: 1, minW: 2, maxW: 4},
    {i: 'c', x: 4, y: 0, w: 2, h: 1}

 
  ]
  const layout2 = [
    {i: 'a', x: 0, y: 0, w: 2, h: 1, static: true},
    {i: 'b', x: 2, y: 0, w: 2, h: 1, minW: 2, maxW: 4, static:true},
    {i: 'c', x: 4, y: 0, w: 4, h: 1}

 
  ]
  const onLayoutChange=(a, b, c) => {
    console.log(a)
    console.log(b)
    console.log(c)
  }
  const onDrop=(layout, item, e)=> {
    console.log(layout)
    console.log(item)
  }
  return (
    <div>
      <ResponsiveGridLayout className="layout"  onLayoutChange={onLayoutChange}  cols={16}   rowHeight={100} onDrop={onDrop} >
        <div key="a" data-grid={ {i: 'a', x: 0, y: 0, w: 1, h: 2, static: false}} className='zl'>grid 拖拽组件直接在组件设置A</div>
        <div key="b" data-grid={{i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4}} className='zl'>grid 拖拽组件B</div>
        <div key="c" data-grid={ {i: 'c', x: 4, y: 0, w: 1, h: 2}} className='zl'>grid 拖拽组件C</div>
        <div key="d" data-grid={ {i: 'd', x: 0, y: 2, w: 1, h: 2}} className='zl'> 拖拽组件D</div>
        <div key="e" data-grid={ {i: 'e', x: 0, y: 4, w: 1, h: 2}} className='zl'> 拖拽组件E</div>
        <div key="f" data-grid={ {i: 'f', x: 0, y: 6, w: 1, h: 2}} className='zl'> 拖拽组件F</div>
      </ResponsiveGridLayout>
      <div style={{width: "100px", height: "100px", border:"1px solid #dedede"}} draggable="true"></div>
    </div>
  )
}
