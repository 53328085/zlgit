import { Button, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import log from './log.png'
const App = () => {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState({
    
    top: '100px'
  })
  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = (e) => {
    console.log(e);
    setOpen(false);
  };
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
  };
  const onStart = (_event, uiData) => {
    console.log(window.document.documentElement.clientWidth)
    const { clientWidth, clientHeight } = window.document.documentElement;
    console.log(draggleRef.current)
    const targetRect = draggleRef.current?.getBoundingClientRect();
    console.log(uiData)
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  console.log(document.body.clientHeight)
  console.log(document.body.clientWidth)
  const mvel = useRef(null)

  const mouseDown = (event) => {
    event.preventDefault();   
   
    let el = mvel.current
    let shiftX = event.clientX - el.getBoundingClientRect().left;
    let shiftY = event.clientY - el.getBoundingClientRect().top;
    mvel.current.style.position = "absolute"
    mvel.current.style.zIndex = 1000;
  
    const moveAt = (x,y) => {
      if ((x-shiftX) < 0 || (y - shiftY) < 0) {
        return
      }
      let xp =  x - shiftX + 'px';
      let yp =  y - shiftY + 'px'
      setStyle(sty => Object.assign({}, sty, {left: xp, top: yp}))
      //el.style.transform=`translate(${xp}, ${yp})`
     // el.style.left = x - shiftX + 'px';
     //el.style.top = y - shiftY + 'px'
      // console.log(el.style.left)
    }
    moveAt(event.clientX, event.clientY)
    
   const onMouseMove = (event) => {
    console.dir(event)
    moveAt(event.clientX, event.clientY)
   }
    document.addEventListener('mousemove', onMouseMove)
    mvel.current.onmouseup = () => {    
      document.removeEventListener('mousemove', onMouseMove)
      mvel.current.onmouseup = null
    }
  //  mvel.current.style.left = clientX + 'px'
  //  mvel.current.style.top = clientY + 'px'
  
  }
  return (
    <div style={{width: "2000px", height:"20000px", overflow: "auto"}}>
      <Button onClick={showModal}>Open Draggable Modal</Button>
      <img src={log}  style={{width: '112px'}} onMouseDown={mouseDown} ref={mvel}></img>
      <Modal
        style={style}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
          
            onMouseDown={mouseDown} ref={mvel}
          >
          
            Draggable Modal
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
       
      >
        <p>
          Just don&apos;t learn physics at school and your life will be full of magic and miracles.
        </p>
        <br />
        <p>Day before yesterday I saw a rabbit, and yesterday a deer, and today, you.</p>
      </Modal>
    </div>
  );
};
export default App;