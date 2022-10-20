import React,{useEffect} from 'react'
import style from './style.module.less'
import imgurl from '@imgs/index.js'
import { Button, } from 'antd'
import  EZUIKit from 'ezuikit-js'; 
import {themeData} from './themeData'
export default function Videolist({showModal,setplay}) {
  
  let player
  useEffect(()=>{
    player= new EZUIKit.EZUIKitPlayer({
      id: 'video',
      accessToken: 'at.9cl77yip98abfs927jrhscoj8cagttcz-9nyz8ow4cj-1e2lldl-xfyg9vtih',
      url: "ezopen://open.ys7.com/G88471891/1.hd.live",
      width: 506, 
      height: 270,
      themeData:themeData,
      
    })
    setplay(player)
    return ()=>{player.stop();console.log('视频清除了')}
  },[])
 
  return (
    <div className={style.videocard}>
        <div className={style.videotitle}>
            <img src={imgurl.camera} style={{marginRight: 16}} alt=""/>
            <div>正泰物联滨江园区-研发1号楼</div>
            <Button style={{marginRight:0,marginLeft: 'auto'}} onClick={showModal}>远程控制</Button>
        </div>
        <div id='video' style={{width:506}}>
              {/* <img src={video} style={{width:'100%',height:'100%'}} alt=""/> */}
        </div>
       
    </div>
  )
}
