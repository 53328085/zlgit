import React, { useState, useEffect } from 'react';
import {useWindowListener} from './useWindowListener.js';
import {StorageAlarmRuntime} from '@api/api'
export default function App() {
    let [count, setCount] = useState(0);
     
   useEffect(() => {
      console.log('count:一次')
      let timer = setInterval(() => {
        console.log('count:' +count)
        setCount(c => c +1)
      }, 1000)
      return () => {
        clearInterval(timer)
      }
   }, [])

  return (
      <div>
         {count}
      </div>
  );
}
