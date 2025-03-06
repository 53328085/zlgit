import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components'
import exbg from './exbg.jpg'
import logo from './log.png'
import arrow from './arrow.png'
import Diskchart from "../diskChartMonitor"
import Diagram from "../diagramMonitor"
const Mainbox=styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  .head {
    height: 48px;
    display: flex;
    background-color: rgba(0, 51, 153, 1);
    font-family: '微软雅黑';
    font-weight: 400;
    font-size: 24px;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    
   
      background-image: url(${logo}), url(${arrow}) ;
      background-repeat: no-repeat, no-repeat;
      background-size:  130px 40px,  180px 48px;
      background-position: left center, left center;
      position: relative;
      .btns{
         display: flex;
         font-size: 18px;
         position: absolute;
         right: 0;
        .btn{ 
          width: 144px;
          height: 48px;
          background-color: rgba(0, 102, 255, 1);
          border: 1px solid rgba(0, 153, 204, 1);
          color: #00FFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          .text {
            padding:0 0.5em 4px;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;
          }
        }
        .btn.active{
          background-color: rgba(0, 153, 51, 1);
          color: #fff;
          .text {
            border-bottom-color: #0f0;
          }
        }
      }
    }
  
  .content {
    flex:1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(${exbg});
    background-repeat: no-repeat;
    background-size: cover;
     
  }
`
export default function Index() {
 const [active, setActive] = useState(1)
 const ref=useRef()
 useEffect(()=> {
   if(ref.current) {
    ref.current.requestFullscreen().catch()
   }
 }, [])
  return (
    <Mainbox ref={ref}>
      <div className="head">
        <div className="logo"></div>
        <span>NGC8 智能配电柜</span>
        <div className='btns'>
          <div className={active==1 ? "btn active" : "btn"}  onClick={()=> setActive(1)}>
             <div className='text'>
                 盘柜图监控
              </div>
          </div>
          <div className={active==2 ? "btn active" : "btn"} onClick={()=> setActive(2)}>
            <div className="text">
            一次图监控
            </div>
         
          </div>
        </div>
      </div>
      <div className="content">
         {
          active== 1 ? <Diskchart /> : <Diagram />
         }
      </div>
    </Mainbox>
  )
}

