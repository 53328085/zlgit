import React from "react";
import style from './style.module.less'
import { Typography} from 'antd'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
export default function Icard(props){
const { Link, Text, Paragraph } = Typography;
const projectId = useSelector(selectProjectId)
console.log(props.history)
    return(
        <div className={style.cardItem}>
            <div className={style.state}>正常</div>
        </div>
    )
}