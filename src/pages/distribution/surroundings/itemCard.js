import React from "react";
import { Divider, Image } from 'antd'
import style from './style.module.less'
import imgurl from '@imgs'
export default function Index(props) {
    return (
        <div className={style.card}>
            <div className={style.leftcard}>
                <div className={style.cardTitle}>{props.title}</div>
                <div className={style.cardData}>{props.value?props.value:'————'}</div>
                <div className={style.desc}>
                    <span className={style.normalSign}></span>
                    <span>{props.desc?props.desc:'异常'}</span>
                </div>
            </div>

            <div className={style.cardContent}>
                <div className={style.imgDiv}>
                    <Image src={imgurl[props.img]} preview={false} />
                </div>

                {/* <Divider dashed style={{borderColor: "#fff", margin: "16px 0"}} />  */}

            </div>
        </div>
    )
}