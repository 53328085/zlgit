// redux
import { useState, useEffect } from "react";
import store from "../redux/store";
import {incrementAction, decrementAction, asyncincrement} from '../redux/actions/count'
console.log(typeof asyncincrement)
const Counter = () => {
  let [value, setValue] = useState(1);
  let [sum, setSum] = useState(store.getState().counter);

  const increment = () =>
    store.dispatch(incrementAction(value));
  const decrement = () =>
    store.dispatch(decrementAction(value));
  const incrementifOdd = () => {
    let counter = store.getState().counter;
    if (counter % 2 == 1) {
      store.dispatch(incrementAction(value));
    }
  };
  const dispansy = () => {
      console.log(22222)
    store.dispatch(asyncincrement(value, 1000))
  }
/*   const asyncIncrement = () => {
      setTimeout(() => {
          increment()
      }, 1000)
  } */
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSum(store.getState().counter);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div>
      <select
        value={value}
        onChange={(e) => setValue(Number(e.target.value) || 0)}
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>{" "}
      Value: {sum} <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={incrementifOdd}>齐数加</button>
      <button onClick={ dispansy}>异步加</button>
    </div>
  );
};

export default Counter;
