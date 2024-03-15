import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import logo from './logo.png'
import './index.css'
const Mainbox = styled.div` 
   .wrapper {
    display: flex;
    width: 320px;
    input[type="text"] {
      flex: 1 1 auto;
    }
    label {
      background-color: tan;
      color: #fff;
      text-align: center;
     
      display: inline-block;
    }
   }
  
`
 
export default function Index() {
  let data =   Array.from({length:4}, (x,i) => i+1)
  const [ratio, setRatio] = useState('')
  
  let mqstring = `(resolution: ${window.devicePixelRatio}dppx)`
  const mediaQueryList = window.matchMedia("(orientation: portrait)");

  const rationQuery = window.matchMedia(mqstring);

  function handleOrientationChange(mql) {
    console.log(mql)
    // ...
  }
  
  const updatePixelRatio = () => {
    console.log(111111)
    let pr = window.devicePixelRatio;
    setRatio(pr);
    let ratios = Math.round(pr*100);
    console.log(ratios)
   // let prString = (pr * 100).toFixed(0);
    //pixelRatioBox.innerText = `${prString}% (${pr.toFixed(2)})`;
  };
  useEffect(() => {
    updatePixelRatio()
    rationQuery.addEventListener("change", updatePixelRatio);
  }, [] )
  return (
    <div className='container'>
        
        <h1>{ratio}</h1>
    </div>
  )
}
