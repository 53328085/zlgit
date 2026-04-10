import React, { useState, useImperativeHandle, forwardRef,useRef } from 'react';
import { Transfer, Switch } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CModal from '@com/useModal'
import suffix from "./icon/suffix.png"
import {CTransfer} from './style'
// 1. 定义拖拽类型
const ItemTypes = {
  TRANSFER_ITEM: 'transferItem',
};

// 2. 创建可拖拽的列表项组件
const DraggableItem = ({ item, onMove, onTransfer, isTargetList }) => {
  // 拖拽源配置
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TRANSFER_ITEM,
    item: { key: item.key, title: item.title },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 放置目标配置
  const [, drop] = useDrop({
    accept: ItemTypes.TRANSFER_ITEM,
    hover: (draggedItem) => {
      // 处理列表内排序：当拖拽项悬停在另一项上时
      if (draggedItem.key !== item.key) {
        onMove(draggedItem.key, item.key);
      }
    },
    drop: (draggedItem) => {
      // 处理跨列表穿梭：当拖拽项被放置到另一个列表中时
      // 如果当前是目标列表（右侧），而拖拽项来自源列表（左侧），则执行穿梭
      if (isTargetList && draggedItem.key !== item.key) {
         onTransfer([draggedItem.key]);
      }
    },
  });

  // 将拖拽和放置的 ref 绑定到 DOM 元素上
  const ref = React.useRef(null);
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
       // padding: '4px 8px',
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
      }}
    >
      {item.title}
     {/*  <div style={{width:11}}>
         <img src={suffix} style={{maxWidth:"100%"}}></img>
      </div> */}
    </div>
  );
};

// 3. 主组件
const DraggableTransfer = ({dataSource,targetKeys,setTargetKeys}, ref) => {
  const modref=useRef()
 

 const [changekey, setChangekey]=useState(targetKeys)

  // 处理穿梭变化
  const handleChange = (newTargetKeys) => {
    console.log("newTargetKeys",newTargetKeys)
    setChangekey(newTargetKeys);
  };

  // 处理列表内移动
  const handleMove = (dragKey, hoverKey) => {
     
    console.log("dragKey",dragKey,"hoverKey",hoverKey)

    // 判断拖拽项和目标项是否都在同一侧（都是源或都是目标）
    const isDragInTarget = changekey.includes(dragKey);
    const isHoverInTarget = changekey.includes(hoverKey);

    if (isDragInTarget === isHoverInTarget) {
      // 如果在同一侧，则进行排序
      const newTargetKeys = [...changekey];
      const dragItemIndex = newTargetKeys.indexOf(dragKey);
      const hoverItemIndex = newTargetKeys.indexOf(hoverKey);
    //  console.log("dragItemIndex",dragItemIndex,"hoverItemIndex",hoverItemIndex)
      // 交换位置
      newTargetKeys.splice(dragItemIndex, 1);
      newTargetKeys.splice(hoverItemIndex, 0, dragKey);
      
      setChangekey(newTargetKeys);
    }
  };

  // 处理跨列表穿梭（通过 drop 事件触发）
  const handleTransfer = (keys) => {
    const newTargetKeys = [...changekey];
    // 简单的穿梭逻辑：如果 key 不在 targetKeys 中，就添加
    keys.forEach(key => {
        if (!newTargetKeys.includes(key)) {
            newTargetKeys.push(key);
        }
    });
    setChangekey(newTargetKeys);
  };
  const onOk=()=>{
    console.log("targetKeys",changekey)
    setTargetKeys(changekey)
    modref.current.onCancel()
  }
  useImperativeHandle(ref,()=>({
    onDisplay:()=> modref.current.onOpen()
  }))
  return (
    <CModal title="表格设置"   ref={modref} onOk={onOk}   width={594} height={440} mold="cust" closable={true}>
    <DndProvider backend={HTML5Backend}>
      <CTransfer
        dataSource={dataSource}
        titles={['未选字段', '已选字段']}
        targetKeys={changekey}
        onChange={handleChange} 
        operationStyle={{width:74}}
        render={(item) => (
          <DraggableItem
            item={item}
            onMove={handleMove}
            onTransfer={handleTransfer}
            isTargetList={changekey.includes(item.key)}
          />
        )}
        showSelectAll={false}
      />
    </DndProvider>
   </CModal>
  );
};

export default forwardRef(DraggableTransfer);