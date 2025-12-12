import { Table } from 'antd';
import update from 'immutability-helper';
import React, { useCallback, useRef, useState,useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const type = 'DraggableBodyRow';
const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = useRef(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: {
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{
        cursor: 'move',
        ...style,
      }}
      {...restProps}
    />
  );
};
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];
const Parent =({children})=> {
 return (<div style={{width: 300,height: 300, margin: '0 auto', backgroundColor: '#ddd'}}> 
 <h2>下面嵌套的子组件</h2>
     {children }
  </div>)
}
const Child = () => {
  return <div>child</div>;
};

const Medi=({onPay, onStop})=> {
  return (
    <div>
      <button onClick={onPay}>支付</button>
      <button onClick={onStop}>停止</button>
    </div>
  );

}
const App = () => {
  const [data, setData] = useState();
  const resolve = Promise.resolve(1)
  useEffect(() => {
    resolve.then(res => {
      console.log(res)
    })
    setData(100)
    console.log(data)
  }, [])
  
  return (
    <div>
     <h1>父组件嵌套</h1>
       <Medi onPay={() => {console.log('支付')}} onStop={() => {console.log('停止')}}></Medi>
    </div>
  );
};
export default App;