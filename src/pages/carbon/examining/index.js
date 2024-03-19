import React, { useEffect, useState, useRef, useMemo } from 'react'
import Pagecount from '@com/pagecontent'
import Card from './card'
import styled from 'styled-components'
import { useReactive } from 'ahooks';
import Titlelayout from '@com/titlelayout';
import { drawEcharts } from '@com/useEcharts'
import Ichart from '@com/useEcharts/Ichart';
import Table from '@com/useTable'

const Flexdiv = styled.div`
display: flex;
.flexuse{
  width:100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;}`
const Griddiv = styled.div`
width:100%;
height:660px;
display:flex;
align-items: center;
justify-content: space-between;
flex-direction: column;
margin-top: 16px;
.bdcolor{
  width:100%;
  height:325px;
  border-radius:4px;
  background-color: #043665;
  display: flex;
  flex-direction: column;
  position:relative;
    .chartBox{
      width:100%;
      .tablestyle{
        margin-top:16px;
        thead .ant-table-cell{
          background-color: ${props => props.theme.primaryColor};
          color: #fff;
        }
      }
      .tipsBox{
        width:400px;
        display: flex;
        flex-direction: row;
        justify-content:space-between;
        position:absolute;
        bottom:20px;
        left:16px;
      }
    }
}`
export default function Index() {
  const cardlist = useReactive([{
    name: '年度总配额(tCO₂)',
    bgcolor: '#043665',
    numberval: 800.00,

  }, {
    name: '年度总目标值(tCO₂)',
    bgcolor: '#043665',
    numberval: 800.00,

  },
  {
    name: '累计排放当量(tCO₂)',
    bgcolor: '#043665',
    numberval: 800.00,

  }, {
    name: '距总预配额剩余排放量(tCO₂)',
    bgcolor: '#333399',
    numberval: 800.00,

  },
  {
    name: '距总目标剩余排放量(tCO₂)',
    bgcolor: '#333399',
    numberval: 800.00,

  }])
  let series = [{ type: "line", areaStyle: null },{ type: "line", areaStyle: null },
  { type: "bar", areaStyle: null },{ type: "bar", areaStyle: null }]
  const [eoptions, setEptions] = useState({   //用电量
    series,
    dataset: {}
  })
  const getData = () => {
    let eleConsumes = [
      { name: "3/1", value: "0.00" ,age:'0'},
      { name: "3/2", value: "1.00",age:'0' },
      { name: "3/3", value: "2.00" ,age:'0'},
      { name: "3/4", value: "3.00" ,age:'0'},
      { name: "3/5", value: "4.00" ,age:'0'},
      { name: "3/6", value: "6.00" ,age:'0'},
      { name: "3/7", value: "40.00",age:'0' },
      { name: "3/8", value: "7.00" ,age:'0'},
      { name: "3/9", value: "8.00" ,age:'0'},
      { name: "3/10", value: "8.00" ,age:'0'},
      { name: "3/11", value: "9.00" ,age:'0'},
      { name: "3/12", value: "4.00" ,age:'0'},
      { name: "3/13", value: "5.00",age:'0' },
      { name: "3/14", value: "30.00",age:'0' },
      { name: "3/15", value: "60.00" ,age:'0'},
      { name: "3/16", value: "0.00" ,age:'0'},
      { name: "3/17", value: "0.00",age:'0' },
      { name: "3/18", value: "0.00" ,age:'0'},
      { name: "3/19", value: "0.00" ,age:'0'},
      { name: "3/20", value: "0.00" ,age:'0'},
      { name: "3/21", value: "0.00",age:'0' },
      { name: "3/22", value: "0.00" ,age:'0'},
      { name: "3/23", value: "0.00" ,age:'0'}]
    let edataset = {
      dimensions: [
        { name: 'name', type: 'time' },
        { name: "value", displayName: '用电量(kWh)' },
        { name: "age", displayName: '用tan量(kWh)' },
      ],
      source: eleConsumes,
    }
    setEptions({
      ...eoptions, dataset: edataset, xAxis: {
        axisLabel: {
          interval: 'auto',
          textStyle: {
            color: '#fff'
          }
        }
      }, yAxis: {
        type: 'value',
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        }
      }, legend: {
        textStyle: {
          color: '#fff'
        }
      }
    })
  }
  const columnstable = [
    { title: '序号', dataIndex: 'key', align: "center", },
    { title: '碳配额项', dataIndex: 'age', align: "center", },
    { title: '年度总预配额', dataIndex: 'address', align: "center", },
    { title: '年度总目标值', dataIndex: 'name', align: "center", },
    { title: '累计排放量', dataIndex: 'name', align: "center", },
    { title: '距预配剩余', dataIndex: 'age', align: "center", },
    { title: '距目标剩余', dataIndex: 'address', align: "center", },
    {
      title: '1月', dataIndex: 'name', align: "center",
      render: (text) => text > 0 ? <span style={{ backgroundColor: '#FFCC33' }}> {text} </span> : 
      text < 0 ? <span style={{ backgroundColor: '#FF5F60' }}> {text} </span> :
       <span style={{ backgroundColor: '#FFF' }}> {text} </span>,
    },
    { title: '2月', dataIndex: 'name', align: "center", },
    { title: '3月', dataIndex: 'age', align: "center", },
    { title: '4月', dataIndex: 'address', align: "center", },
    { title: '5月', dataIndex: 'name', align: "center", },
    { title: '6月', dataIndex: 'name', align: "center", },
    { title: '7月', dataIndex: 'age', align: "center", },
    { title: '8月', dataIndex: 'address', align: "center", },
    { title: '9月', dataIndex: 'name', align: "center", },
    { title: '10月', dataIndex: 'name', align: "center", },
    { title: '11月', dataIndex: 'age', align: "center", },
    { title: '12月', dataIndex: 'address', align: "center", },
  ]
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区',

    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区',
    },
    {
      key: '3',
      name: '胡彦斌',
      age: 32,
      address: '西湖区',

    },
    {
      key: '4',
      name: '胡彦祖',
      age: 42,
      address: '西湖区',
    },
    {
      key: '5',
      name: '胡彦斌',
      age: 32,
      address: '西湖区',

    },
    {
      key: '6',
      name: '胡彦祖',
      age: 42,
      address: '西湖区',
    },

  ];
  // const linedom = useRef()
  // const linedata = useReactive({
  //   yAxis: {
  //     type: 'value',
  //     axisLabel: {
  //       textStyle: {
  //         color: '#fff'
  //       }
  //     }
  //   },
  //   xAxis: {
  //     type: 'category',
  //     data: ['1#楼', '2#楼', '3#楼', '4#楼', '5#楼', '6#楼'],
  //     axisLabel: {
  //       textStyle: {
  //         color: '#fff'
  //       }
  //     }
  //   },
  //   legend: {
  //     show: 'true',
  //     type: 'plain',
  //     left: 'center',
  //     top: 'bottom',
  //     textStyle: {
  //       color: '#fff'
  //     }
  //   },
  //   grid: {
  //     left: '2%',
  //     containLabel: true,
  //     top: 20,
  //     bottom: 20
  //   },
  //   series: [
  //     {
  //       name: '1',
  //       type: 'line',
  //       data: [18203, 23489, 29034, 104970, 131744, 630230],
  //     }, {
  //       name: '2',
  //       type: 'line',
  //       data: [19203, 24489, 26034, 154970, 181744, 600230],
  //     },
  //     // {
  //     //   name: '3',
  //     //   type: 'bar',
  //     //   data: [18203, 23489, 29034, 104970, 131744, 630230]
  //     // }, {
  //     //   name: '4',
  //     //   type: 'bar',
  //     //   data: [19203, 24489, 26034, 154970, 181744, 600230]
  //     // },
  //   ]
  // })
  useEffect(() => {
    getData()
  }, [])
  return (

    <Pagecount bgcolor="#eeeff3" pd={0}>
      <Flexdiv>
        <div className='flexuse'>
          {cardlist.map(it => <Card {...it} />)}
        </div>
      </Flexdiv>
      <Griddiv>
        <div className='bdcolor'>
          <Titlelayout title="月度碳排考核分析(tCO₂)" layout="flex" bgcolor="#043665" bg="#043665" fc="#fff">
            <div className='chartBox'>
              {/* <div ref={linedom} style={{ width: '100%', height: '100%' }}></div> */}
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to top right, rgb(16,32,61), rgb(4,53,102))' }}>
                <Ichart {...eoptions} />
              </div>
            </div>
          </Titlelayout>

        </div>
        <div className='bdcolor'>
          <Titlelayout title="碳排放数据(tCO₂)" layout="flex">
            <div className='chartBox'>
              <Table columns={columnstable} className="tablestyle" pagination={{
                pageSize: 5,
              }}
                rowKey={(columns) => columns.key} dataSource={dataSource} />
                <div className='tipsBox'>
                  <p>
                    <span style={{backgroundColor:'#FFCC33',width:'24px',height:'10px',color:'#FFCC33',marginRight:'16px'}}>123456</span>
                    <span>月度排放量(超标值)</span>
                  </p>
                  <p>
                    <span style={{backgroundColor:'#FF5F60',width:'24px',height:'10px',color:'#FF5F60',marginRight:'16px'}}>123456</span>
                    <span>月度排放量(超预配值)</span>
                  </p>
                </div>
              {/* <div ref={linedom} style={{ width: '100%', height: '100%' ,background: 'linear-gradient(to right, rgb(16,32,61), rgb(3,60,95))'}}></div> */}
            </div>
          </Titlelayout>

        </div>
      </Griddiv>
    </Pagecount>
  )
}
