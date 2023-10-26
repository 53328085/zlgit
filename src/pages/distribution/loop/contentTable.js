import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import Table from '@com/useTable'

export default function ContentTable(props) {
    
    return(
        <Table 
        className='tableHeader' 
        rowClassName='tableRow'  
        columns={props.columns} 
        dataSource={props.tableData} 
        scroll={{y: props.height}} 
        bordered  
        size='small' 
        pagination={false}></Table>
    )
}