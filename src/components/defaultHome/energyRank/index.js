import React, {useRef, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout';
import { useReactive } from 'ahooks';
import { message } from 'antd';
import { energyRanking } from '@api/api.js'
import Ichart from "@com/useEcharts/Ichart"
import {CustTransO} from "@com/useButton"
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
    const [option, setOption] = useState({
        series: [{
            type: "bar",
             label: {
                show: true,
                align: "left",
             },
             itemStyle: {
                borderRadius: 15
             }
            }],
        grid: {
            right: "16px",
            left: "16px",
            top: "16px",
            bottom: "0px",
             show: false,
             containLabel: true,
         },
        legend: {
            show: false
        },
        xAxis: {
            type: 'value',
            show: false,
        },
        yAxis: {
            type: 'category',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            }
        },
        dataset: {
            dimensions: [],
            source: []
        }
    })
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
            type: 2, // 1 改成 2。 1 日， 2月  来自毕工
          }).then(res => {
            if(res.success && res.data){
                let {building} = res.data
                state.rankList = res.data.building
                if(Array.isArray(building) && building.length > 0) {
                    let build = building.slice(0,3).reverse()
                    setOption({
                        ...option,
                        dataset: {
                            dimensions: ["name", {name: "value", displayName: "月能耗"}],
                            source:build
                        }
                    })
                }


            }else{
              message.error(res.errMsg)
            }
          })
        
        
    } else if (props.type == 'configure') {
        
      return;
    }
  }, [type])
  
  return (
         <Titlelayout title={<CustTransO text="EnergyConsumptionRankingthismonth" />} {...fs} style={{height: "200px"}}>
            <Divorder>
                <Ichart {...option}/>
            </Divorder>
         </Titlelayout>      
    
  )
}
