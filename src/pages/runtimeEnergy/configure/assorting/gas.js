import React from "react";
import CommonTab from './commonTab'

export default function Electric (props) {
    const dataprops = {
        type: 3,
        title:'能耗分类(燃气)'
    }
    const getFromChild = val => {
        props.getValues(val)
       }
    return (
        <CommonTab {...dataprops} getValues={getFromChild}></CommonTab>
    )
}