import React from "react";
import style from './style.module.less'

export default function Index(props) {
    return (
        <div className={style.progressBorder}>
            <div className={style.progressBar} style={{width: props.percent+'%'}}>
                <span style={{color : (props.percent > 10) ?'#fff' :'#333'}}>{props.percent + '%'}</span>
            </div>
        </div>
    )
}