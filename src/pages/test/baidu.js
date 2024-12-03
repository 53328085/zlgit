 
import React, { useState, useRef, useEffect } from 'react';
import {Typography} from 'antd'
import {CaretRightOutlined} from '@ant-design/icons'
import styled from 'styled-components';
 import {renderAsync} from 'docx-preview'
 
 //import 'jszip'
const App = ({num=2}) => {
  let mp;
  function baiduMapInit () {
    const url = `http://api.map.baidu.com/api?v2.0&ak=rc5CPv1UPUfL1qdkQvHEkFGNSUE4GQPG&callback=onBMapCallback`
      return new Promise((resolve, reject) => {
        if (typeof BMap !== 'undefined') {
          
          resolve()
          return
        }
        window.onBMapCallback = function () {
          resolve()
        }
        let scriptNode = document.createElement('script')
        scriptNode.setAttribute('type', 'text/javascript')
        scriptNode.setAttribute('src', url)
        // scriptNode.setAttribute('crossorigin', 'anonymous')
        document.body.appendChild(scriptNode)
        scriptNode.onerror = (e) => {
          let error = ''
          Object.keys(e).forEach(item => {
            error += item + ': ' + e[item] + '  '
          })
          error += 'errStringify:' + JSON.stringify(e, ['message', 'arguments', 'type', 'name'])
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('地图加载失败：' + error)
        }
      })
    }
 
   useEffect(() => {
    baiduMapInit().then(res => {
      console.log(window.BMap)
     })
     
   }, [])
   return(
    <div style={{margin: "30px"}}>
       
   

       
    </div>
   )
};
export default App;