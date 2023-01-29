import React from "react";
import { Card, Image, Typography } from "antd";
import { nanoid } from "@reduxjs/toolkit";
import icon from "./img/electric.png";
import style from './style.module.less'
const { Text, Paragraph } = Typography;
export default function Custcard(props) {
  const device = props.device;
  const totalNum = props.totalNum
  let point = device.data?.slice(0, 4) || []
  let len = 4 - point?.length,  arr = [];               
  if (len > 0) {
    arr = new Array(len).fill({ Description: "", Display: "" });
    point = [...point, ...arr];
  }
 const Points =point.map(p => (
  <div  key={nanoid()}>
   <div   className={style.left} title={p.description?.length > 5 ? p.description : ''}>
    {p.description}
  </div>
 
  <div  className={style.right} title={p.display?.length > 14 ? p.display : ''}>
    {p.display}
  </div>
</div>)
)
 
  return (
       
        <div className={style.item}>
          <div className={style.textbox}
             style={{backgroundColor: device.status == 1 ? '#52c41a' : device.status == 2 ? '#666' : '#ff4d4f'}}
          >
         <span> {device.status == 1 ? '优秀' : device.status == 2 ? '离线' : '告警'}</span>
          </div>
          <div className={style.imgbox} >
            <img 
              src={
                device.categoryImageBase64
                  ? "data:image/png;base64," + device.categoryImageBase64
                  : icon
              }
            />
          </div>
          <div className={style.mainright}>
            <div className={style.upcontent}>
              <div>
                <span>设备编号</span>
                <Text ellipsis>{device.sn}</Text>
              </div>              
              <div>
                <span>设备型号</span>
                <span >{device.categoryName}</span>
              </div>
              <div>
                <span>安装位置</span>
                <span>{device.address}</span>
              </div>
            </div>
           
            <div className={style.info}>
                {Points}
            </div>            
          </div>
        </div>
     
  );
}
