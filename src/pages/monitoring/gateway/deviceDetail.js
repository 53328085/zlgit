import React from "react";
import style from './style.module.less'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
export default function Icard(props){
const projectId = useSelector(selectProjectId)
    return(
        <div className={style.cardItem}>
            <div className={style.state}>正常</div>
        </div>
    )
}