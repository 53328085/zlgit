import React,{useEffect} from 'react'
import style from './style.module.less'
import imgurl from '@imgs/index.js'
import { Button } from 'antd/lib'
import  EZUIKit from 'ezuikit-js'; 

export default function Videolist() {
  let player;
  useEffect(()=>{
    // player = new EZUIKit.EZUIKitPlayer({
    //     id:"video",

    // })
  },[])
  return (
    <div className={style.videocard}>
        <div className={style.videotitle}>
            <img src={imgurl.camera} style={{marginRight: 16}} />
            <div>正泰物联滨江园区-研发1号楼</div>
            <Button style={{marginRight:0,marginLeft: 'auto'}}>远程控制</Button>
        </div>
        <div id='video' style={{width:506,height:270}}>

        </div>
    </div>
  )
}
