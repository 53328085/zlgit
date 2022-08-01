
import {useState, useEffect, useReducer, useRef} from 'react'
import {Login} from './axios/api'
import store from './store/store'
//import {connect} from 'react-redux'
//import {addGood, deleteGood, asyncAdd} from './store/store'
function TbItem() {
    return (
        <div>
            <h2>这是淘宝详情页</h2>
            <p>当前购物车内商品数量：{store.getState().goods.length}</p>
            <button onClick={() => store.dispatch({type: 'add', good: {title: `淘宝商品${Date.now()}`, price: 100}})}>添加购物车</button>
     </div>
    )
}
function TmItem() {
    return (
        <div>
            <h2>这是天猫详情页</h2>
            <p>当前购物车内商品数量：{store.getState().goods.length}</p>
         <button onClick={() => store.dispatch({type: 'add', good: {title: `天猫商品${Date.now()}`, price: 200}})}>添加购物车</button>
     </div>
    )
}
function Cart() {
    let goods = store.getState().goods
    console.log(goods)
    return (
        <ul>
          
        {
            goods.map((good, index) => {
             return (
                 <li key={index}>
                     <span>{good.title}</span>
                     <button onClick={() => store.dispatch({type: 'delete', good: {index}})}>删除</button>
                 </li>
             )
         })
     }
     </ul>
 )
}
function App() {
    return (
      <div className="App">
       <TbItem></TbItem>
       <TmItem/>
        <Cart></Cart>
      </div>
    );
  }
  export default App
