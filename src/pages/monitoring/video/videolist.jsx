import React,{useEffect} from 'react'
import style from './style.module.less'
import imgurl from '@imgs/index.js'
import { Button, } from 'antd'
import  EZUIKit from 'ezuikit-js'; 
import video from '@imgs/video.gif'

export default function Videolist({showModal,setplay}) {
  let player
  useEffect(()=>{
    player= new EZUIKit.EZUIKitPlayer({
      id: 'video',
      accessToken: 'at.2hyc53ltbwytyh1i8r669k4zdbua2t43-7efxli8xb0-0g9ij9v-iewfmsfph',
      url: "ezopen://open.ys7.com/G88471891/1.hd.live",
      width: 506, 
      height: 270,
      template:'standard',
      header:['capturePicture'],
      
    })
    setplay(player)
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
