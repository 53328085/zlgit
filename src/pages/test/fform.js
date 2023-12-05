import { useState, useTransition, memo, Fragment, useDeferredValue, Suspense, useEffect, useRef} from 'react';
import styled from 'styled-components';
 const Main =styled.div`
  display: flex;
  padding: 20px;
   .ani {
    background-color: aqua;
    color: #fff;
    height: 30px;
    width: 100%;
   }
   .cylon_eye {
  background-color: red;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.9) 25%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.9) 75%
  );
  color: white;
  height: 100%;
  width: 60px;
  animation:  eye 5s linear 0.3s, ear 5s linear 0.3s ;
  }
  @keyframes eye {
    from {
      margin-left: -10%;
    }
    to {
      margin-left:110%
    }
  }

  @keyframes  ear{
    from {
      margin-left: -10%;
      font-size: 14px
    }
    to {
      font-size:28px;
      margin-left:110%
    }
  }
  .ai {

  
    width: 600px;
    padding: 8px;
   // border: 1px solid #dedede;
    animation: scrol 3s linear 0.1s infinite ;
    &:hover {
      animation-play-state: paused;
    }
  }
 
 `
 const Adiv = styled.div`
    width: 600px;
    padding: 8px;
   // border: 1px solid #dedede;
    animation: ${props => `scrol ${props.step}s linear   infinite`};
    &:hover {
      animation-play-state: paused;
    }
    @keyframes scrol {
    from {
      transform: translateY(0);
    }
    to {
      // transform:  ${props => `translateY(-${props.h}px)` };
    }
  }
 `
 export default function Index(){
  const ref = useRef()
  const [h, setH] = useState(0)
  const [step, setSeepd] = useState(0)
  useEffect(() => {
    let el = ref.current.getBoundingClientRect();
    setH(el.height)
     setSeepd(el.height / 60)
  }, [])

   return (
    <Main>
       
      <div style={{border: "1px solid #dedede", overflow: "hidden"}}>
        <Adiv   ref={ref} h={h} step={step}> 
        <p>是使元素从一种样式逐渐变化为另一种样式的效果。</p>
        <p> 您可以改变任意多的样式任意多的次数。</p>
        <p>请用百分比来规定变化发生的时间，或用关键词 "from" 和 "to"，等同于 0% 和 100%。</p>
        
        
      </Adiv>
      </div>
    </Main>
   )

 }
/* 

key 只有在就近的数组上下文中才有意义

*/