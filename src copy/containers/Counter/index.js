// 引入UI组件
// import Counter from '../components/Statemgre'
// 引入Store
import store from '../../redux/store'
// 引入connect
import {connect} from 'react-redux'
import {useState} from 'react'
import {incrementAction, decrementAction, asyncincrement} from '../../redux/actions/count'
// 创建UI组件
const Counter = ({counte, onadd, ondecrement, onasyncincrement, persons}) => {
    // let counter = props.prop
    console.log(counte)
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
       onasyncincrement(value, 1000)
       //store.dispatch(asyncincrement(value, 1000))
     }
   
     return (
       <div>
         <h1>人数: {persons.length}</h1>
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

const  mapStateToProps = (state, ownProps) => { // <Counter counte={counter}/>
    return {
        counte: state.data.counter,
        sum: state.data.sum
    }
}

 //const ContainerCount = connect(mapStateToProps, mapDispatchToProps)(Counter) // 创建容器组件
const mergeProps = (stateProps, dispatchProps, ownProps) => {  
  
  return Object.assign({}, {counte:stateProps.data, ...dispatchProps.data, ...ownProps})
 }
 const ContainerCount = connect(  //优化
     (state, ownProps) =>({counte: state.data.counter, sum: state.data.sum, persons:state.persons}), 
    /*  (dispatch, ownProps) => (  // mapDispatchToProps 函数形式
       {
            onadd: (playload) => {
                dispatch(incrementAction(playload))
            },
            ondecrement: (playload) => {
                dispatch(decrementAction(playload))
            },
            onasyncincrement: (playload) => {
                dispatch(asyncincrement(playload, 1000))
            }
        }
     ) */
     { // mapDispatchToProps 对象形式
        onadd: incrementAction  ,
        ondecrement:  decrementAction,
        onasyncincrement:asyncincrement
    }
 )(Counter)
    
 export default ContainerCount 
 // 容器组件可以监测redux中的状态改变