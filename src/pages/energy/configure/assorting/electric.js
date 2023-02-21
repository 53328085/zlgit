import React from "react";
import CommonTab from './commonTab'

export default function Electric () {
    const dataprops = {
        type: 1,
        title:'能耗分类(电)'
    }
    return (
        <CommonTab {...dataprops}></CommonTab>
    )
}