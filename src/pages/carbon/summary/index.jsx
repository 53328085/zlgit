import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Form, Image, message, Progress, Select } from 'antd'
import Pagecount from '@com/pagecontent'
import Card from './card'
import Card1 from './card1'
import styled from 'styled-components'
import { useReactive } from 'ahooks';
import { Radiogroup } from "@com/comstyled"
import Titlelayout from '@com/titlelayout';
import imgurl from '../../distribution/summary/icon/index'
import style from "./style.module.less";
import { drawEcharts } from '@com/useEcharts'
import Table from '@com/useTable'
const Flexdiv = styled.div`
display: flex;
.flexuse{
  width:100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;}
  .useage{
    width: 100%;
    height: 128px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #d7d7d7;
    padding: 16px;
    display: flex;
    flex-direction: column;
    .flexuse{
      width:100%;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;
      .use{
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
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
const Griddiv = styled.div`
width:100%;
height:320px;
display:flex;
align-items: center;
justify-content: space-between;
flex-direction: row;
margin-top: 16px;
.a{
  width:1200px;
  height:320px;
  grid-area: a;
}
.b{
  width:769px;
  height:320px;
  grid-area: b;
}
.c{
  width:464px;
  height:320px;
  grid-area: c;
  .tableclass{
    margin-top:16px;
    flex: 1;
    .parent {
      width: 100%;
      height: 230px;
      overflow-y: scroll;
      scrollbar-width: none;
      -ms-overflow-style: none;
  }

  .parent::-webkit-scrollbar {
      display: none;
  }

  /*设置的子盒子高度大于父盒子，产生溢出效果*/
  .child {
      height: auto;
  }

  .child li {
      height: 50px;
      margin: 2px 0;
      line-height:50px;
      color:#3B3B3B;
      display:flex;
     // background: #009678;
     .childBox{
      width:107px;
      text-align:center;
      line-height:50px;
     }
  }
  .child li:nth-of-type(odd){ background:#fff;}//奇数行
  .child li:nth-of-type(even){ background:rgb(242,242,242);}//偶数行 
  }
}
.d{
  width:415px;
  height:320px;
  grid-area: d;
}
.bdcolor{
  position:relative;
    border-radius:4px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
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
    .chartBox{
      width:100%;
      height:100%;
      
    .dateBox{
      position:absolute;
      top:16px;
      right:10px;
      z-index:100
    }
    }
} 
.tablestyle{
  thead .ant-table-cell{
    background-color: rgb(236,245,255);
    color: #0B1D36;
  }
}
`

export default function Index() {
  const [form] = Form.useForm()
  const projectId = useSelector(state => state.system.menus.projectId)
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions = oneLevel.length > 0 ? useMemo(() => ([{ name: oneLevel[0].levelName + '(全部)', id: 0 }, ...oneLevel]), [oneLevel]) : []
  const [radiovalue, setRadioValue] = useState(0);
  const onChange = ({ target: { value } }) => {
    setRadioValue(value);
  };
  const [radiovalue1, setRadioValue1] = useState(1);
  const onChange1 = ({ target: { value } }) => {
    setRadioValue1(value);
  };
  const [radiovalue2, setRadioValue2] = useState(1);
  const onChange2 = ({ target: { value } }) => {
    setRadioValue2(value);
  };
  const [radiovalue3, setRadioValue3] = useState(1);
  const onChange3 = ({ target: { value } }) => {
    setRadioValue3(value);
  };
  const options = [
    {
      label: '日',
      value: 0,
    },
    {
      label: '月',
      value: 1,
    },
    {
      label: '年',
      value: 2,
    },
  ];
  const options1 = [
    {
      label: '月',
      value: 1,
    },
    {
      label: '年',
      value: 2,
    },
  ];
  const linedom = useRef()
  const linedata = useReactive({
    yAxis: {
      type: 'value',
    },
    xAxis: {
      type: 'category',
      data: ['1#楼', '2#楼', '3#楼', '4#楼', '5#楼', '6#楼']
    },
    grid: {
      left: '2%',
      containLabel: true,
      top: 20,
      bottom: 20
    },
    series: [
      {
        type: 'line',
        data: [18203, 23489, 29034, 104970, 131744, 630230]
      },
    ]
  })

  const columndom1 = useRef()
  const columndata1 = useReactive({
    yAxis: {
      type: 'value',
    },
    xAxis: {
      type: 'category',
      data: ['1#楼', '2#楼', '3#楼', '4#楼', '5#楼', '6#楼']
    },
    grid: {
      left: '2%',
      top: 20,
      bottom: 20,
      containLabel: true
    },
    legend: {
      show: 'true',
      type: 'plain'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    series: [
      {
        name: '本月',
        stack: 'total',
        type: 'bar',
        data: [18203, 23489, 29034, 104970, 131744, 630230]
      },
      {
        name: '上月',
        stack: 'total',
        type: 'bar',
        data: [18203, 23489, 29034, 104970, 131744, 630230]
      },
    ]
  })
  const columnstable = [
    { title: '名称', dataIndex: 'name', align: "center", },
    { title: '碳排放量(t)', dataIndex: 'age', align: "center", },
    { title: '目标值(t)', dataIndex: 'address', align: "center", },
    { title: '达标率(%)', dataIndex: 'name', align: "center", },
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
    {
      key: '7',
      name: '胡彦斌',
      age: 32,
      address: '西湖区',

    },
    {
      key: '8',
      name: '胡彦祖',
      age: 42,
      address: '西湖区',
    },
  ];
  const columndom2 = useRef()
  const columndata2 = useReactive({
    type: 3,
    pieData: {
      data: [{ value: 65, name: '电' }, { value: 20, name: '燃气' }, { value: 15, name: '煤炭' }],
    },
    legend: {
      left: 'center',
      top: 'bottom',
    },
  })
  const [areavalue, setAreavalue] = useState(0)
  const changeArea = (v) => {
    setAreavalue(v)
  }
  const dateval = useReactive([1, 1, 1, 1])
const cardlist1=useReactive([{
  name: '年度配额(tCO₂)',
  bgcolor: '#333399',
  numberval: 1000.00,
  compareval: '2.54%'
}, {
  name: '年度排放当量(tCO₂)',
  bgcolor: '#0066CC',
  numberval: 200.00,
  compareval: '2.54%'
},])
  const cardlist = useReactive([ {
    name: '年度剩余碳排放额(tCO₂)',
    bgcolor: '#006699',
    numberval: 800.00,

  }, {
    name: '直接排放(tCO₂)',
    bgcolor: '#6633CC',
    numberval: 800.00,

  },
  {
    name: '间接排放(tCO₂)',
    bgcolor: '#660099',
    numberval: 800.00,

  }])
  useEffect(() => {
    drawEcharts(linedom.current, linedata)
    drawEcharts(columndom1.current, columndata1)
    drawEcharts(columndom2.current, columndata2)
  }, [])

  const [isScrolle, setIsScrolle] = useState(true);

  // 滚动速度，值越小，滚动越快
  const speed = 30;
  const warper = useRef();
  const childDom1 = useRef();
  const childDom2 = useRef();

  // 开始滚动
  useEffect(() => {
    // 多拷贝一层，让它无缝滚动
    childDom2.current.innerHTML = childDom1.current.innerHTML;
    let timer;
    if (isScrolle) {
      timer = setInterval(
        () =>
          warper.current.scrollTop >= childDom1.current.scrollHeight
            ? (warper.current.scrollTop = 0)
            : warper.current.scrollTop++,
        speed
      );
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isScrolle]);

  const hoverHandler = (flag) => setIsScrolle(flag);
  return (

    <Pagecount bgcolor="#eeeff3" pd={0}>
      <Flexdiv>
        <div className='flexuse'>
          {
            cardlist1.map(it => <Card1 {...it} />) }
            {cardlist.map(it => <Card {...it} />)}</div>
      </Flexdiv>
      <Griddiv>
        <div className='bdcolor a'>
          <Titlelayout title="实时碳排放(tCO₂)" layout="flex">
            <div className='chartBox'>
              <div className='dateBox'>
                <Radiogroup options={options}
                  onChange={onChange}
                  value={radiovalue}
                  optionType="button"
                  buttonStyle="solid" />
              </div>
              <div ref={linedom} style={{ width: '100%', height: '100%' }}></div>
            </div>
          </Titlelayout>

        </div>

        <div className='bdcolor c'>
          <Titlelayout title="碳排放排名" >
            <div className='chartBox'>
              <div className='dateBox'>
                <Radiogroup options={options1}
                  onChange={onChange1}
                  value={radiovalue1}
                  optionType="button"
                  buttonStyle="solid" />
              </div>
              <div className='tableclass' >
                <Table columns={columnstable} className="tablestyle" rowKey={(columns) => columns.key} dataSource={dataSource} scroll={{
                  y: 200,
                }} />
              </div>
            </div>

          </Titlelayout>


        </div>

      </Griddiv>
      <Griddiv>
        <div className='bdcolor b'>
          <Titlelayout title="月度碳排放(tCO₂)" >
            <div className='chartBox'>
              {/* <div className='dateBox'>
                <Radiogroup options={options}
                  onChange={onChange}
                  value={radiovalue}
                  optionType="button"
                  buttonStyle="solid" />
              </div> */}
              <div ref={columndom1} style={{ width: '100%', height: '100%' }}></div>
            </div>

          </Titlelayout>

        </div>
        <div className='bdcolor d'>
          <Titlelayout title="碳排占比" >
            <div className='chartBox'>
              <div className='dateBox'>
                <Radiogroup options={options1}
                  onChange={onChange2}
                  value={radiovalue2}
                  optionType="button"
                  buttonStyle="solid" />
              </div>
              <div ref={columndom2} style={{ width: '100%', height: '100%' }}></div>
            </div>

          </Titlelayout>

        </div>
        <div className='bdcolor c'>
          <Titlelayout title="分类能耗" >
            <div className='chartBox'>
              <div className='dateBox'>
                <Radiogroup options={options1}
                  onChange={onChange3}
                  value={radiovalue3}
                  optionType="button"
                  buttonStyle="solid" />
              </div>
              <div className='tableclass' >
                {/* <Table columns={columnstable} className="tablestyle" /> */}
                <div className='parent' ref={warper}>
                  <div className='child' ref={childDom1}>
                    {dataSource.map((item) => (
                      <li
                        key={item}
                        onMouseOver={() => hoverHandler(false)}
                        onMouseLeave={() => hoverHandler(true)}
                      >
                        <span className='childBox'>{item.name}</span>
                        <span className='childBox'>{item.age}</span>
                        <span className='childBox'>{item.address}</span>
                        <span className='childBox'>{item.name}</span>
                      </li>
                    ))}
                  </div>
                  <div className='child' ref={childDom2}></div>
                </div>
              </div>
            </div>

          </Titlelayout>


        </div>


      </Griddiv>
    </Pagecount>

  )
}
