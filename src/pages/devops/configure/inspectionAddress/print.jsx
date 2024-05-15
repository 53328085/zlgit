import React, { useEffect,useRef,useCallback,forwardRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import QRCode,{QRCodeCanvas}  from 'qrcode.react';
import styled from 'styled-components'
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import './index.less'
import style from './style.module.less'
const PrintDom = styled.div`
  height: 200px;
  width: 555px;
  border: 2px solid #1E2D56;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  z-index: -1;
  left: 50%;
  top: ${props=>{ return props.index*220}}px;
  transform: translateX(-50%);
  .bgcss{
    width: 547px;
    height: 192px;
    background-color: #1E2D56;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0 30px;
    .list{
        color: #fff;
        font-size: 18px;
        line-height: 40px;
    }
  }
  .pdlf{
    padding-left: 50px;
  }
` 
export default forwardRef(function Print({print,index='index'}) {
  const onelevel = useSelector(state => state.system.onelevel);
  const printRef =useRef()
  const reactToPrintContent = useCallback(() => {
    return printRef.current;
  }, [printRef.current])
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
  })

  useEffect(()=>{
    if(isNaN(index) ){
      handlePrint()
    }

  },[print]) 
  return (
      
         <PrintDom id='printddom' ref={printRef} className={index==3  ? 'printcss page-break' : 'printcss'} index={index}>
        <div className='bgcss'>
            <div className='list'>
                <p>
                    <span>巡检点编号</span>
                    <span className='pdlf'>{print.id}</span>
                </p>
                <p>
                    <span>{onelevel[0]?.levelName}</span>
                    <span className='pdlf'>{print.areaName}</span>
                </p>
                <p>
                    <span>具体位置</span>
                    <span className='pdlf'>{print.position}</span>
                </p>
            </div>
            <QRCodeCanvas value={print.id.toString()} style={{padding:10,background:'#fff'}}/>
        </div> 
        </PrintDom>
       
      
       
    
  )
}
)