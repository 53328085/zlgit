import React from "react";
import CommonTab from './commonTab'

export default function Steam(props) {
    const dataprops = {
        type: 18,
        title: '能耗分类(蒸汽)'
    }
    const getFromChild = val => {
        props.getValues(val)
    }
    return (
        <CommonTab {...dataprops} getValues={getFromChild}></CommonTab>
    )
}