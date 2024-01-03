import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout';
import { useReactive } from 'ahooks';
import { message } from 'antd';
import { energyRanking } from '@api/api.js'

const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}

const Divorder = styled.div`
  height: 140px;
  .rank_item{
    display: flex;
    align-items: center;
    padding-top: 23px;
    font-size: 14px;
    color: #515151;
    .item_name{
        width: 92px;
        line-height: 22px;
        height: 22px;
        margin-right: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .item_progress{
        height: 22px;
        border-radius: 20px;
        line-height: 20px;
        color: #fff;
        padding-left: 16px;
    }
  }
  
`

export default function DefaultHome(props){
    const {type} = props
    const projectId = useSelector(selectProjectId)

    const state = useReactive({
        rankList:[
            {
                name:'联合工房',
                value:'850.00'  
            },{
                name:'快充区',
                value:'800.00'  
            },{
                name:'1F锅炉循环泵',
                value:'600.00'  
            },{
                name:'建设指挥部',
                value:'550.00'  
            },{
                name:'员工食堂',
                value:'450.00'  
            },{
                name:'3号高架库',
                value:'400.00'  
            },{
                name:'工艺用电',
                value:'300.00'  
            },
        ]
    })

    const { Query } = energyRanking

  useEffect(() => {
    if (type == 'runtTime') {
        const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;

		month = month > 9 ? month : '0' + month;

        Query({
            projectId: projectId,
            areaId: 0,
            date: year + '-' + month,
            energytype: 1,
            shiftId: 0,
            type: 1
          }).then(res => {
            if(res.success && res.data){
                state.rankList = res.data.building
            }else{
              message.error(res.errMsg)
            }
          })
        
        
    } else if (props.type == 'configure') {
        
      return;
    }
  }, [type])
  
  return (
         <Titlelayout title={'本月能耗排名'} {...fs} style={{height: "200px"}}>
            <Divorder>
                { state.rankList.length > 0 ? <div className='rank_item'>
                    <div className='item_name' title={state.rankList[0].name}>{ state.rankList[0].name }</div>
                    <div className='item_progress' style={{ width: '304px', backgroundColor:'#f03' }}>{ state.rankList[0].value + ' kWh' }</div>
                </div> : null }
                { state.rankList.length > 1 ? <div className='rank_item'>
                    <div className='item_name' title={state.rankList[1].name}>{ state.rankList[1].name }</div>
                    <div className='item_progress' style={{ width: '285px', backgroundColor:'#f66' }}>{ state.rankList[1].value + ' kWh' }</div>
                </div> : null }
                { state.rankList.length > 2 ? <div className='rank_item'>
                    <div className='item_name' title={state.rankList[2].name}>{ state.rankList[2].name }</div>
                    <div className='item_progress' style={{ width: '231px', backgroundColor:'#f90' }}>{ state.rankList[2].value + ' kWh' }</div>
                </div> : null }
              {/*    { state.rankList.length > 3 ? <div className='rank_item'>
                    <div className='item_name' title={state.rankList[3].name}>{ state.rankList[3].name }</div>
                    <div className='item_progress' style={{ width: '216px', backgroundColor:'#3c9' }}>{ state.rankList[3].value + ' kWh' }</div>
                </div> : null }
               { state.rankList.length > 4 ? <div className='rank_item'>
                    <div className='item_name' title={state.rankList[4].name}>{ state.rankList[4].name }</div>
                    <div className='item_progress' style={{ width: '197px', backgroundColor:'#399' }}>{ state.rankList[4].value + ' kWh' }</div>
                </div> : null }
                { state.rankList.length > 5 ? <div className='rank_item'>
                    <div className='item_name' title={state.rankList[5].name}>{ state.rankList[5].name }</div>
                    <div className='item_progress' style={{ width: '177px', backgroundColor:'#237ae4' }}>{ state.rankList[5].value + ' kWh' }</div>
                </div> : null }
                { state.rankList.length > 6 ? <div className='rank_item'>
                    <div className='item_name' title={state.rankList[6].name}>{ state.rankList[6].name }</div>
                    <div className='item_progress' style={{ width: '144px', backgroundColor:'#27d4ff' }}>{ state.rankList[6].value + ' kWh' }</div>
                </div> : null } */}
            </Divorder>
         </Titlelayout>      
    
  )
}
