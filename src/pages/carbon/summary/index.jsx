import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Form, Image, message, Progress, Select } from 'antd'
import Pagecount from '@com/pagecontent'
import Card from './card'
import styled from 'styled-components'
import { useReactive } from 'ahooks';
import BlueColumn from '@com/bluecolumn'
import imgurl from '../../distribution/summary/icon/index'
import {drawEcharts} from '@com/useEcharts'
import  Table from '@com/useTable'
const Flexdiv= styled.div`
display: flex;
  .useage{
    width: 768px;
    height: 128px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #d7d7d7;
    padding: 16px;
    display: flex;
    flex-direction: column;
    .flexuse{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-grow: 1;
      .use{
        display: flex;
        flex: 1;
        align-items: center;
        margin-left: 20px;
        img{
        width: 42px;
        height: 42px;
        margin-right: 8px;
      }
      .unit{
        color: #999;
        font-size: 12px;
        padding-left: 6px;
      }
      .useval{
        font-size: 24px;
        color: #666;
      }
      }
     
    }
  }

`
const Griddiv =styled.div`
flex: 1;
display: grid;
grid-template-areas:"a b c""d d c";
grid-template-columns:592px 592px 464px;
grid-template-rows: 320px 319px;
grid-gap: 16px;
margin-top: 16px;
.a{
  grid-area: a;
}
.b{
  grid-area: b;
}
.c{
  grid-area: c;
  .tableclass{
    margin-top:16px;
    height:100%;
    width:100%
  }
}
.d{
  grid-area: d;
}
.bdcolor{
    border: 1px solid #d7d7d7;
    border-radius:4px;
    padding: 16px;
    background-color: #fff;
    .mgauto{
     margin-left: auto;
     display: flex;
     border: 1px solid #e9e9e9;
     .datestyle{
      width: 64px;
      height: 24px;
      text-align: center;
      cursor: pointer;
     }
     .active{
      background-color: #237ae4;
      color: #fff;
     }
    }
} 
.tablestyle{
  thead .ant-table-cell{
    background-color: #237ae4;
    color: #fff;
  }
}
`

export default function Index() {
  const [form] = Form.useForm()
  const projectId = useSelector(state => state.system.menus.projectId)
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions =oneLevel.length>0? useMemo(() => ([{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel]), [oneLevel]):[]
  
  const piedom =useRef()
  const piedata =useReactive({
    type:3,
    pieData:{
      data:[{value:65,name:'电'},{value:20,name:'燃气'},{value:15,name:'煤炭'}],
      
    },
    legend:{
      left: 20,
      top:'middle',
      orient: 'vertical',
    },
  })
 
  const columndom1 =useRef()
  const columndata1 =useReactive({
    xAxis: {
      type: 'value',
    },
    yAxis:{
      type:'category',
      data:['1#楼','2#楼','3#楼','4#楼','5#楼','6#楼']
    },
    grid:{
      left:40,
      top:20,
      bottom:50
    },
    series:[
      {
        type: 'bar',
        data: [18203, 23489, 29034, 104970, 131744, 630230]
      },
    ]
  })
  const columnstable = [ 
    { title: '名称', dataIndex: 'name', align: "center",  },
    { title: '碳排放量(t)', dataIndex: 'name', align: "center",  },
    { title: '目标值(t)', dataIndex: 'name', align: "center",  },
    { title: '达标率(%)', dataIndex: 'name', align: "center",  },
  ]
  const columndom2 =useRef()
  const columndata2 =useReactive({
    xAxis: {
      type: 'category',
      data:['01','02','03','04','01','02','03','04','01','02','03','04']
    },
    yAxis: {
      type: 'value',
    },
    grid:{
      left:60,
      top:30,
      bottom:45
    },
    series:[
      {
        name:'碳排放(吨)',
        type: 'bar',
        data: [18203, 23489, 29034, 104970, 131744, 630230,18203, 23489, 29034, 104970, 131744, 630230]
      },
    ]
  })
  const [areavalue, setAreavalue] = useState(0)
  const changeArea = (v) => {
    setAreavalue(v)
  }
  const dateval =useReactive([1,1,1,1])

  const cardlist = useReactive([{
    name:'年度配额(tCO₂)',
    bgcolor:'#009966',
    numberval:1000.00,
    compareval:'2.54%'
  },{
    name:'年度排放当量(tCO₂)',
    bgcolor:'#000099',
    numberval:200.00,
    compareval:'2.54%'
  },{
    name:'年度剩余碳排放额(tCO₂)',
    bgcolor:'#ff6600',
    numberval:800.00,
    
  }])
  useEffect(()=>{
    drawEcharts(piedom.current,piedata)
    drawEcharts(columndom1.current,columndata1)
    drawEcharts(columndom2.current,columndata2)
  },[])
  return (
    <div style={{ flex: 1, display: "flex", justifyContent: 'center', alignContent: 'center' }}>
      <Pagecount bgcolor="#eeeff3" pd={0}>
        <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={areaOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={oneLevel.length > 0 ? 0 : null}></Select>
            </Form.Item>
          </Form>
        </div>
        <Flexdiv>
          {
            cardlist.map(it=><Card {...it}/>)
            
          } 
          <div className='useage'>
          <BlueColumn name="碳排结构" bg={{ width: 4,height: 24}} ></BlueColumn>
          <div className='flexuse'>
            <div  className='use'>
            <img src={imgurl.z06} alt="" />
            <div>
              <p>用电量<span className='unit'>(kwh)</span></p>
              <p className='useval'>100.30</p>
            </div>
            </div>

            <div  className='use'>
            <img src={imgurl.z04} alt="" />
            <div>
              <p>用燃气量<span className='unit'>(m³)</span></p>
              <p className='useval'>100.30</p>
            </div>
            </div>

            <div  className='use'>
            <img src={imgurl.z01} alt="" />
            <div>
              <p>煤吨量<span className='unit'>(吨)</span></p>
              <p className='useval'>100.30</p>
            </div>
            </div>
          </div>
          </div> 
        </Flexdiv>
        <Griddiv>
          <div className='bdcolor a'>
            <BlueColumn name="碳排占比">
            <div className='mgauto'>
                <div className={`datestyle ${dateval[0]===1?'active':''}`} onClick={()=>{dateval[0]=1}}>月</div>
                <div className={`datestyle ${dateval[0]===2?'active':''}`} onClick={()=>{dateval[0]=2}}>年</div>
              </div>
            </BlueColumn>
            <div ref={piedom} style={{width:'100%',height:'80%'}}></div>
          </div>
          <div className='bdcolor b'>
          <BlueColumn name="碳排放量排名(tCO₂)" >
              <div className='mgauto'>
              <div className={`datestyle ${dateval[1]===1?'active':''}`} onClick={()=>{dateval[1]=1}}>月</div>
              <div className={`datestyle ${dateval[1]===2?'active':''}`} onClick={()=>{dateval[1]=2}}>年</div>
              </div>
          </BlueColumn>
          <div ref={columndom1} style={{width:'100%',height:'100%'}}></div>
          </div>
          <div className='bdcolor c'>
          <BlueColumn name="碳排放达标率" >
              <div className='mgauto'>
              <div className={`datestyle ${dateval[2]===1?'active':''}`} onClick={()=>{dateval[2]=1}}>月</div>
              <div className={`datestyle ${dateval[2]===2?'active':''}`} onClick={()=>{dateval[2]=2}}>年</div>
              </div>
          </BlueColumn>
          <div className = 'tableclass' >
          <Table columns ={columnstable} className="tablestyle"/>
          </div>
          
          </div>
          <div className='bdcolor d'>
          <BlueColumn name="碳排放量(tCO₂)" >
              <div className='mgauto'>
              <div className={`datestyle ${dateval[3]===1?'active':''}`} onClick={()=>{dateval[3]=1}}>月</div>
              <div className={`datestyle ${dateval[3]===2?'active':''}`} onClick={()=>{dateval[3]=2}}>年</div>
              </div> 
          </BlueColumn>
          <div ref={columndom2} style={{width:'100%',height:'100%'}}></div>
          </div>
          
        </Griddiv>
      </Pagecount>
    </div>
  )
}
