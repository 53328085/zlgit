import React, {useState, useMemo, memo, Fragment, useCallback, useRef, Component,useEffect, useImperativeHandle, useLayoutEffect, useDebugValue}from 'react'
import SubDome from './SubDome'
const Counter=React.memo(({getNum}) => {
  return (
    <h1>counter: {getNum()}</h1>
  )
})
const FancyButton = React.forwardRef((props, ref) => { // 函数式组件 ref
  return (
    <button ref={ref}>{props.children}</button>
  )
})
function BtIpt(props, ref) {
  const ifr = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      ifr.current.focus()
    },
    input: (v) => {
      console.log(v)
    }
  }))
  return (
    <input ref={ifr}></input>
  )
}
BtIpt = React.forwardRef(BtIpt)
 class DemoInput extends Component { // 类组件 ref
  textInput = React.createRef()
  getfocus = () => {
    this.textInput.current.focus()
  }
  render() {
    return (
      <div>
        <input ref={this.textInput}></input>
        <button onClick={() => this.getfocus}>getfouc</button>
      </div>
    )
  }
}
class Demotext extends Component { // 类组件 ref回调函数
  textref = null
  textInput = (dome) => {
    console.log(dome)
    this.textref = dome
  }
  getfocus = () => {
    console.log(222)
    console.log(this.textref)
    if(this.textref) this.textref.focus()
  }
  render() {
    console.log(this)
    return (
      <div>
        <textarea ref={this.textInput}></textarea>
        <button onClick={this.getfocus}>ref回调函数</button>
      </div>
    )
  }
}


 function XDemo(props) {
  return (
    <div>
      <input ref={props.iptref} ></input>
    </div>
  )
}


class XCemo extends Component {
  inputel = null
  componentDidMount() {
    console.log(this.inputel)
  }
  render() {
    return (
      <div>
        <XDemo iptref={el => this.inputel = el}></XDemo>
      </div>
    )
  }
}


export default function Demo() {

  const [count, setCount] = useState(1);
  const updatacount = (count) => count +1
  const [val, setValue] = useState('');
  let ref = useRef(1)
  const getRef = () => {
    setTimeout(() => {
    console.log(ref.current)
    }, 1000)
  }

 
  /*   function getNum() {     
        console.log('原生的函数') 
        return Array.from({length: count * 100}, (v, i) => i).reduce((a, b) => a+b)
    } */
   /*  const getNum = useMemo(() => {
     
      return Array.from({length: count * 100}, (v, i) => i).reduce((a, b) => a+b)
    }, [count])  */
    const getNum = useCallback(() => {
      console.log('useCallback优化')
      return Array.from({length: count * 100}, (v, i) => i).reduce((a, b) => a+b)
    }, [count])
    const refbt = React.createRef()
    const refipt = React.createRef()
    const refcom = React.createRef()
    const uif = useRef()
    const getfouc = () => {
      alert(refipt.current.value)
    }
    useEffect(() => { // []空数组的话想当于componentDidMount [value] componentDidUpdate
      console.log('@')
      let timer = setInterval(() => {
        setCount(count => ++count)
      }, 1000)
      return () => { // componentWillUnmount 卸载时调用 
        console.log('@')
        clearInterval(timer)
      }
    },[])
    useLayoutEffect(()=> {
    
    })
   useDebugValue('hello')
    return (
      <div>
        {/*   <Counter getNum={getNum}/> */}
          <h2>{ref.current}</h2>
          <div>
              <h2>count: {count}</h2>
             <button onClick={() => setCount(updatacount)}>+1</button>    
              <button onClick={() => ref.current++}>修改ref值</button>
              <button onClick={() => getRef()}>显示值</button>
              <input  value={val} onChange={event => setValue(event.target.value)}/>
              <input placeholder='通过ref获取实例' ref={refipt}></input>
              <button onClick={getfouc}>获取焦点</button>
          </div>
          <p>
            <FancyButton ref={refbt}>自定义按钮</FancyButton>
          </p>
          <div>
              <DemoInput ref={refcom}></DemoInput>
          </div>
          <div>
             <Demotext/>
          </div>
          <div>
            <XCemo></XCemo>
          </div>
          <div>
            <BtIpt ref={uif}/>
          </div>
          <Fragment key={122} >
             <i>1</i>
             <i>2</i>
          </Fragment>
          <>
          <b>1111</b><b>2222</b>
          </>
      </div>
    );
}
