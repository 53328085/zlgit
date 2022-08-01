// react-redux
import { useState} from "react";


const Counter = ({counte, onadd, ondecrement, onasyncincrement}) => {
 // let counter = props.prop
  let [value, setValue] = useState(1);


  const increment = () =>{
      onadd(value)
  }
   
  const decrement = () =>{
    ondecrement(value)
  }
   
  const incrementifOdd = () => {  
    if (counte % 2 == 1) {
      onadd(value)
    }
  };
  const dispansy = () => {
    onasyncincrement(value)
    //store.dispatch(asyncincrement(value, 1000))
  }
/*   const asyncIncrement = () => {
      setTimeout(() => {
          increment()
      }, 1000)
  } */
/*   useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSum(store.getState().counter);
    });
    return () => unsubscribe();
  }, []); */
  return (
    <div>
      <select
        value={value}
        onChange={(e) => setValue(Number(e.target.value) || 0)}
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>
      Value:{counte}  <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={incrementifOdd}>齐数加</button>
      <button onClick={ dispansy}>异步加</button>
    </div>
  );
};

export default Counter;
