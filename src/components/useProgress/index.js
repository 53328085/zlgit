import React from "react";
import style from './style.module.less'

export default function Index(props) {
    return (
        <div className={style.progressBorder}>
            <div className={style.progressBar} style={{width: props.progress+'%'}}>
                {props.progress > 10? <span style={{color : (props.progress > 10) ?'#fff' :'#333'}}>{props.progress + '%'}</span> : null}
            </div>
            {props.progress <= 10? <span style={{color : (props.progress > 10) ?'#fff' :'#333', position: 'absolute',left:0, fontSize: 12}}>{props.progress + '%'}</span> : null}
        </div>
    )
}