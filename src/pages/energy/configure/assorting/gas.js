import React from "react";
import CommonTab from './commonTab'

export default function Electric () {
    const dataprops = {
        type: 5,
        title:'能耗分类(燃气)'
    }
    return (
        <CommonTab {...dataprops}></CommonTab>
    )
}