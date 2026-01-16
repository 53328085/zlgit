import React, {useMemo, useState, useRef} from 'react'
import  Titlelayout from '@com/titlelayout'
import {Radio, Checkbox, Space} from 'antd'
import {CustTitle,ChartWrap} from  "../style"
import {viewOpt} from '../data'
import Ichart from '@com/useEcharts/Ichart'
import UseTable from '@com/useTable'
import {WrapTable} from '@com/comstyled'
import {isObject} from "@com/usehandler"
import {ExportExcel} from "@com/useButton"
export default function Index({datas={},quota=[],showquota,energyTypes, view,energytype}) {  
  const {proportion=[],consumeDetail=[], tableDatas } = datas || {}
  const [checked, setChecked]=useState(false)
  const tbref=useRef()
  let [columns, dataSource] =useMemo(()=>{ 
    try {
      if(isObject(tableDatas)){
        let {datas, heads} = tableDatas
        let columns = heads.map(t=>({...t, spans: {}}))
        if(Array.isArray(datas) && Array.isArray(heads)) {
          let tbdata = datas.map((d,i) =>  {
            let {data,mergeInfo, ...rest} =d
            for(let [key, value] of Object.entries(mergeInfo)){
              let idx = columns.findIndex(h => h.dataIndex === key)  
              if(isObject(columns[idx])) { 
                columns[idx].spans[i]=value 
              }
            
            }
            if(isObject(data)){
              return {...rest, ...data}
            }else  {
              return {...rest }
            }
          })
          columns?.forEach(c => {
             let handlers={}
             if(Object.keys(c.spans)?.length>0 ) { 
                   for(let [key, value] of Object.entries(c.spans)){
                   
                      handlers[key]=()=>value
                      
                   } 
             }
             c["handlers"]=handlers
          })
          columns?.forEach(c => {
            const {spans, handlers} =c
            c["onCell"]= (row, idx) => { 
               if(Object.keys(spans)?.length>0){
                 
                 return  handlers?.[idx]?.()
               }else {
                return {}
               }

            }
         })
          return [columns, tbdata]
        }else{
          return [[],[]]
  
        }
       
      }else {
        return [[],[]]
      }
    } catch (error) {
      return [[],[]]
    }
   
     
  },[tableDatas])
  const isdiplay= showquota && checked
  const [unit, etitle, display] =useMemo(()=> {
   const unit= view==1 ? {
      1: 'kWh',
      2: "m³",
      3: "m³",
      7: "m³"
     }[energytype] : "元"
     const title =view==1 ? {
      1: '电量(kWh)',
      2: "用水(m³)",
      3: "用气(m³)",
      7: "用水(m³)"
     }[energytype]??"" : "元"
     const display =view==1 ? {
      1: '电量',
      2: "用水",
      3: "用气",
      7: "用水"
     }[energytype]??"" : "元" 
   return [unit, title, display]

  }, [view, energytype])
  const pieopt = useMemo(()=>{
    let total = proportion?.reduce((a,b)=> a+ parseFloat(b.value),0)
    return{
        type: 3,
        pieData: { data: proportion, total,radius:"50%", label: {
            formatter: "{c}"+unit,
          }, },
        legend: {
          top: 'auto',
          bottom: 16,
          //  orient: 'vertical',
          // left: 'left'
        },
        grid: {
          containLabel: true,
          left: 0,
          right: 0,
        },
       
    }
},[proportion,unit])
const lineopt=useMemo(()=>{
    return{
        title: {
            text: etitle,
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal',
                color: 'rgba(144, 147, 153, 1)',
            },
        },
      
        series: isdiplay? [{ 
          type: "bar", 
          seriesLayoutBy: 'row', 
          tooltip:{
          valueFormatter: value=> value+unit
          }, 
         },
         { 
          type: "line", 
          seriesLayoutBy: 'row',  
          smooth:0.3, 
          tooltip:{
            valueFormatter: value=> value+unit
            }, 
         }
        
        ]:[{ 
          type: "bar", 
          seriesLayoutBy: 'row', 
          tooltip:{
          valueFormatter: value=> value+unit
          }, 
         }],
        grid: {
          left: "0px",
          right: "0",
          top: "40px",
          bottom: "0px",
          containLabel: true,
        },
        legend: {
          show:true
          // itemHeight: 4,
          // itemWidth: 16,
        },
        xAxis: {
          axisLabel: {
            showMaxLabel: true,
            hideOverlap: true,
            interval: "auto"
          }
        },
        dataset: {
            dimensions: isdiplay ? [
                { name: '时间', type: 'time' },
                { name: display },
                { name: "定额线" },
              ]:[
                { name: '时间', type: 'time' },
                { name: display },
    
              ],
              source: isdiplay ? [consumeDetail?.[0]?.x, consumeDetail?.[0]?.y, quota]:[consumeDetail?.[0]?.x, consumeDetail?.[0]?.y],
              sourceHeader: false,
        },
    }
}, [consumeDetail,etitle, display,unit, isdiplay])
  const [value,setValue]=useState(1)
  const ckChange =(e) => {
    setChecked(e.target.checked)
  }
  const title=<CustTitle>
    <span>分类能耗明细</span>
    <Space size={16}>{showquota && <Checkbox onChange={ckChange}>定额线</Checkbox>}
    <Radio.Group options={viewOpt} buttonStyle="solid" optionType='button' value={value} onChange={(e)=>setValue(e.target.value)} ></Radio.Group>
      <ExportExcel tb={tbref} single={true} disabled={value==1} /> 
    </Space>
  </CustTitle>
  return (
    <Titlelayout title={title} layout="flex">
    {value==1 ? <ChartWrap> 
        <div className="pip">
         <Ichart {...pieopt} />
        </div>
        <div className='bar'>
          <Ichart {...lineopt} />
        </div>
      </ChartWrap> :
 <WrapTable>
  <div className="inwrap">
     <UseTable columns={columns} dataSource={dataSource} ref={tbref} />
  </div>
  </WrapTable>}
    </Titlelayout>
  )
}
