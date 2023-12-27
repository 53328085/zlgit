import React, {useEffect} from 'react'
export default  function useAuto() {
const handleScreenAuto = () => {
  const designDraftWidth = 1920; //设计稿的宽度
  const designDraftHeight = 960; //设计稿的高度
  //根据屏幕的变化适配的比例
  const scale =
      document.documentElement.clientWidth / document.documentElement.clientHeight < designDraftWidth / designDraftHeight
          ? document.documentElement.clientWidth / designDraftWidth
          : document.documentElement.clientHeight / designDraftHeight;
  //缩放比例
  (document.querySelector("#root")).style.transform = `scale(${scale}) translate(-50%)`;
};

 
useEffect(() => {
 
  handleScreenAuto();
  
  window.onresize = () => handleScreenAuto();
 
  return () => (window.onresize = null);
}, []);
 
}




export const detectZoom = () => {
    console.log(window.screen)
    let ratio = 0,
      screen = window.screen,
      ua = navigator.userAgent.toLowerCase();
    if (window.devicePixelRatio !== undefined) {
      ratio = window.devicePixelRatio;
    } else if (~ua.indexOf('msie')) { // IE浏览器
      if (screen.deviceXDPI && screen.logicalXDPI) {
        ratio = screen.deviceXDPI / screen.logicalXDPI;
      }
    } else if ( // opera浏览器
      window.outerWidth !== undefined &&
      window.innerWidth !== undefined
    ) {
      ratio = window.outerWidth / window.innerWidth;
    }
    if (ratio) {
      ratio = Math.round(ratio * 100);
    }
    return {
        ratio,
        screen,
    };
  }
