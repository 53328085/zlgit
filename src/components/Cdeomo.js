import React, {useReducer} from 'react'

//const initialState = {count: 0};
const init = (initialCount) => {
    return {count: initialCount}
}
function recducer (state, action) {
    console.log(action)
    switch (action.type) {
        case 'increment':
            return {count: state.count + 1}
        case 'decrement':
            return {count: state.count - 1}
        case 'reset':
                return init(action.payload)
        default:
            return state
    }
}
export default function Cdeomo({initialCount}) {
  const [state, dispatch] = useReducer(recducer, initialCount, init);
  const arr = Array.from({length: 1 * 100}, (v, i) => {
      console.log(v)
      console.log(i)
      return i
  });
  console.log(arr)
  return (
    <div>
        <h2>useReducer</h2>
       <h6>count: {state.count}</h6>
       <div>
           <button onClick={() => dispatch({type: 'increment'})}>increment</button>
           <button onClick={() => dispatch({type: 'decrement'})}>decrement</button>
           <button onClick={() => dispatch({type: 'reset', payload: initialCount })}>reset</button>
       </div>
    </div>
  )
}
