import React, { Component, Fragment, useContext, PureComponent } from 'react'
import {ChildComponent} from './Hocfn'
import {Button} from 'antd'
import style from './index.module.less'
import style2 from './index2.module.less'
console.log(style)
const CustContent = React.createContext()
 class UseDome extends PureComponent {
  state = {
    count: 0, 
    name: ['朱正林'],
    sts: ['xiao', 'wang']
  }
 
  add = ()=>{
     /*  this.setState({
          count: this.state.count+1
      }, () => {
          console.log('count'+this.state.count)
      }) */
     // console.log(this.state.count)
    
    // this.setState({count: this.state.count+1})  
    let sts = this.state.sts
    sts.push('sss')
    this.setState(this.state)  
  }
   //lis = Array.from({length: 10000}, (v, i) => i)

  render() {
    console.log(this.state)
    return (
      <div>
          <p className={style.h1}>count: {this.state.count}</p>
          <p className={style2.h1}>{this.state.sts && this.state.sts.map(i => <span key={i}>{i}</span>)}</p>
          <Button onClick={() => this.add()}>新增</Button>

          <div>
          {/*   age: {this.props.userInfo.age}
            name: {this.props.userInfo.name} */}
          </div>
         {/*  <ul>
            {this.lis.map(li => <li key={li}>{li}</li>)}
          </ul> */}
           <DomeA  child={(name) => <DomeB  name={name} />}>
             
           </DomeA>
        </div>
    )
  }
}


 class DomeA extends PureComponent {
  state = {
    name:['朱斯文'],
    hasError: false

  }
   static getDerivedStateFromError(error) {
     console.log(error)
     return {hasError: true}
   }
  componentDidCatch(error) {
    console.log(error)
  }
  render() {
    console.log('A组件渲染')
    return (
      <div><h1>A组件渲染</h1>
       
       {this.state.hasError ?  <h1>数据加载错误，请稍后再试</h1> : this.props.child(this.state.name)}
       
   
      </div>
    )
  }
}
class DomeB extends Component {
  render() {
    console.log('B组件')
    return (
      <div>
        <h1>B</h1>
        <h2>{this.props.name.map((item, index) => <p key={index}>{item}</p> )}</h2>
      </div>
    )
  }
}
/* class DomeC extends Component {
  static contextType = CustContent

  render() {
   let  {name, age} = this.context
    return (
      <div>
        <h1>C</h1>
       <p> {name}, {age}</p>
       </div>
    )
  }
} */
function DomeC() {
  let  {name, age} = useContext(CustContent)

  
     return (
       <div>
         <h1>C</h1>
         <CustContent.Consumer>
           {value => <p><span>{value.name}</span><span>{value.age}</span></p>}
         </CustContent.Consumer>
        </div>
     )
 
}
export default UseDome 