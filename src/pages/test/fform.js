import React, { useState, useEffect, useRef, useCallback, useEvent, useReducer } from "react";
import { useLatest, useMemoizedFn } from 'ahooks';
 
const custuseref = (value) => {
  const ref = useRef()
  ref.current = value
  return ref

}
const initialState = {count: 0}; // 数据创库

function reducer(state, action) {
  switch(action.type) {
    case 'add':
      return {...state, count: state.count + 1}
    case 'decrement':
      return {...state, count: state.count - 1}
    default:
      throw new Error()
  }
}


function init(initialCount) {
  return {count: initialCount};
}

function reducers(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducers, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}


export default () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [count, setCount] = useState(0);
  const timer = useRef()
  const curcount = custuseref(count)
  const log = () => {
    console.log(curcount.current)
  }
  const add = () => {
    let num = count + 1
    setCount(num)
     
  }
  const callbk = useMemoizedFn(() => {
    console.log('count:'+ count)
  })

  return (

    <div>
     <Counter initialCount={10} />
      count: {state.count}

      <br />

      <button onClick={() => dispatch({type: 'add'})}>增加 1</button>
      <br />
      <button onClick={() => dispatch({type: 'decrement'})}>减少1</button>
      <br />
      <button onClick={callbk}>usecallback</button>
    </div>

  );

};
 