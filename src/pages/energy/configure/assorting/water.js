import React from "react";
import CommonTab from './commonTab'

export default function Electric () {
    const dataprops = {
        type: 2,
        title:'能耗分类(水)'
    }
    return (
        <CommonTab {...dataprops}></CommonTab>
    )
}