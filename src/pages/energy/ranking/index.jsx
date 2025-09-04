import React, { useMemo, useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Ichart from '@com/useEcharts/Ichart';
import { energyRanking } from '@api/api'
import Pagecount from "@com/pagecontent";
import Titlelayout from '@com/titlelayout';
import { getTime } from '@com/usehandler'
import { useRequest } from 'ahooks'
import { Select, Form, Radio, DatePicker, Divider, message,Cascader, Space } from 'antd'
import moment from "moment";
import first from './img/first.png'
import second from './img/second.png'
import third from './img/third.png'
import fourth from './img/fourth.png'
import fifth from './img/fifth.png'
import Cempty from '@com/useEmpty'

const { RangePicker } = DatePicker;
const Main = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  column-gap: 8px;
`
const Mainbox = styled.div`
  display: flex;
  flex-direction: column;
  flex:1 1 1072px;
  height: 100%;
  overflow-y: auto;
  .chart {
    width: 100%;
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .chart1 {
    width: 100%;
    height: 727px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
const MainboxRight = styled.div`
  display: flex;
  flex-direction: column;
  flex:1 1 580px;
  height: 100%;
  overflow-y: auto;
  .chart {
    width: 100%;
    height: 500px;
    max-height: 520px;
    display: flex;
    align-items: center;
    flex-direction: column;
   /*  padding: 16px 0;
    border-top: 1px dashed #e8e8e8;
    margin-top: 16px; */
  }
`
export default function Index() {
  let { exparams, setCustview } = useOutletContext()
  console.log(exparams)
  const projectId = useSelector(state => state.system.menus.projectId)
  const [dataList, setDataList] = useState([])
  const [dateRang, setDateRang] = useState([moment().subtract(1, 'month'), moment()])

  const getQuery = () => {
    let params = {
      projectId,
      start: exparams.dateC ? exparams.dateC[0].format('YYYY-MM-DD') : dateRang[0].format('YYYY-MM-DD'),
      end: exparams.dateC ? exparams.dateC[1].format('YYYY-MM-DD') : dateRang[1].format('YYYY-MM-DD')
    }
    energyRanking.QueryEnergyRankByArea(params).then(res => {
      if (res.success) {
        console.log(res.data)
        setDataList(res.data)
      } else {
        message.error(res.errMsg)
      }
    })

  }
  useEffect(() => {
    getQuery()
  }, [projectId, exparams.dateC])

  const dataset = {
    source: [],
    dimensions: [
      { name: 'name' },
      { name: 'value', displayName: '能耗' },

    ]
  }
  const [optionsRank, setOptionsRank] = useState({
    series: [{ type: "bar" }],
    grid: {
      left: "0px",
      right: "0",
      top: "0px",
      bottom: "35px",
      containLabel: true,
    },
    legend: {
      bottom: "5px",
    },
    xAxis: {
      type: 'value',

    },
    yAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
    },
    dataset: {
      dimensions: [{ name: "name" }, { name: "value", displayName: "能耗" }],
      source: [],
    }
  })

  const changeDate = (date, dateString) => {
    console.log(date, dateString)
    setDateRang(dateString)
  }
  const [Type, setType] = useState('a')
  const changeType = (e) => {
    console.log(e.target.value)
    setType(e.target.value)
  }
  const [areaList, setAreaList] = useState([])
  const [options,setoptions]=useState([])
  const [aList,setaList]=useState([])
  const [areaList1, setAreaList1] = useState([])
  const [areaListChoose, setAreaListChoose] = useState([{ areaId: 0,level:1 }])
  const addAllOption = (data) => {
    data.forEach(item => {
    if(item.childs && item.childs.length > 0)
     {console.log(item.childs)
      item.childs.unshift({ areaId: 0, name: '全部', childs: [],level:item.level+1 });
      if (item.childs && item.childs.length > 0) {
        addAllOption(item.childs);
      }}
    });
  };
  const getAreaList = () => {
    // energyRanking.QueryAreaSetting(projectId).then(res => {
    //   if (res.success) {
    //     setAreaList(res.data)
    //     setAreaList1(res.data)
    //     let list = []
    //     res.data.map((item, index) => {
    //       let it = {
    //         level: '', areaId: ''
    //       }
    //       it.level = item.level
    //       item.areaList.unshift({ id: 0, name: '全部', parentId: 0 })
    //       it.areaId = item.areaList[0]?.id || 0
    //       list.push(it)
    //     })
    //     console.log(list)
    //     setAreaListChoose(list)
    //   } else {
    //     message.error(res.errMsg)
    //   }
    // })
    energyRanking.QueryAreaSettingTrees(projectId).then(res => {
      if (res.success) {
        const modifiedData = res.data.map(item => ({
          ...item,
          childs: [...item.childs]
        }));
        addAllOption(modifiedData);
        setoptions(modifiedData);
        console.log(modifiedData)
        // let list = [];
        // modifiedData.map((item, index) => {
        //   let it = {
        //     level: '', areaId: ''
        //   };
        //   it.level = item.level;
        //   it.areaId = item.childs[0]?.id || 0;
        //   list.push(it);
        // });
        // console.log(list);
        // setAreaListChoose(list);
      } else {
        message.error(res.errMsg)
      }
    })
  }
  useEffect(() => {
    getAreaList()
  }, [projectId])
  const [optionsDevice, setOptionsDevice] = useState({
    series: [{ type: "bar" }],
    grid: {
      left: "0px",
      right: "0",
      top: "0px",
      bottom: "35px",
      containLabel: true,
    },
    legend: {
      bottom: "5px",
    },
    xAxis: {
      type: 'value',

    },
    yAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
    },
    dataset: {
      dimensions: [{ name: "name" }, { name: "value", displayName: "能耗" }],
      source: [],
    }
  })
  const [deviceList, setDeviceList] = useState({})
  const getDeviceList = () => {
    let data = {
      projectId,
      start: exparams.dateC ? exparams.dateC[0].format('YYYY-MM-DD') : dateRang[0].format('YYYY-MM-DD'),
      end: exparams.dateC ? exparams.dateC[1].format('YYYY-MM-DD') : dateRang[1].format('YYYY-MM-DD'),
    }
    energyRanking.QueryEnergyRankByDevice(data, areaListChoose).then(res => {
      if (res.success) {
        setDeviceList(res.data)
        setOptionsDevice({ ...{ ...optionsDevice, dataset: { ...dataset, source: res.data?.consumeRank.slice(0, res.data.rankCount).reverse() } } })
      } else {
        message.error(res.errMsg)
      }
    })
  }
  useEffect(() => {
    getDeviceList()
  }, [projectId, JSON.stringify(exparams)])
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };
  const [sortSelected, setSortSelected] = useState('')
  const handleSortChange = (val,select) => {
    console.log(val,select)
    setaList(val)
    let list=[]
      if(select){
        select.map(it=>{
          let items={areaId:0,level:0}
          items.level=it.level
          items.areaId=it.areaId
          list.push(items)
        })
        console.log(list)
        setAreaListChoose(list)
      }else{
        list.push({areaId:0,level:1})
        setAreaListChoose(list)
      }
      //setAreaListChoose(areaListChoose)
    // setSortSelected(new Date().getTime())
    // const filteredList = filterAreaList(areaList1, item, val);
    // setAreaList(filteredList)
    // areaListChoose.forEach((items) => {
    //   if (items.level == item.level) {
    //     items.areaId = val
    //   }
    //   setAreaListChoose(areaListChoose)
    // })
  }
  const filterAreaList = (areaList, list, val) => {
    console.log(areaList, list, val);
    return areaList.map(item => {
      if (item.level == list.level + 1) {
        const filteredChildren = (val != 0) ? item.areaList.filter(its => {
          return its.parentId === val || its.parentId == 0;
        }) : item.areaList
        console.log(filteredChildren);
        // 如果过滤后的子列表为空，则不保留当前 item
        if (filteredChildren.length === 0) {
          return null;
        }

        return {
          ...item,
          areaList: filteredChildren
        };
      } else {
        return item;
      }
    }).filter(Boolean); // 过滤掉 null 值
  };
  const imgs = [first, second, third, fourth, fifth]

  const CustView = ({ v, d,l }) => {
    const form = Form.useFormInstance()
    useEffect(() => {
      form.setFieldValue('sortA', v)
    }, [v])
    useEffect(() => {
      form.setFieldValue('areaL', l)
    }, [l])
    useEffect(() => {
      form.setFieldValue('dateC', d)
    }, [d])
    return (
      <Space>
        <Form.Item name="sortA" initialValue="a" label="能耗排名"    style={{ marginLeft: 'auto', marginRight: '16px' }}>
          <Radio.Group defaultValue="a" buttonStyle="solid" onChange={changeType}>
            <Radio.Button value="a">按区域</Radio.Button>
            <Radio.Button value="b">按设备</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {Type == 'b' ? 
        // areaList?.map((item, index) => {
        //   return <Form.Item name={"areaL" + index}>
        //     <Select options={item.areaList} fieldNames={{ label: 'name', value: 'id' }}
        //       defaultValue={item.areaList[0]?.id}  style={{ width: 120, marginRight: '16px' }}
        //       onChange={(val) => handleSortChange(item, val)}></Select></Form.Item>
        // })
        <Form.Item name="areaL" initialValue={aList}>
        <Cascader options={options} style={{ width: 200,marginRight:'16px' }} fieldNames={{
          label: 'name',
          value: 'areaId',
          children: 'childs',
        }} onChange={(val,select) => handleSortChange(val,select)} placeholder="请选择区域"/></Form.Item>
         : null}

        <Form.Item name="dateC" initialValue={dateRang} label="日期选择">
          <RangePicker format="YYYY-MM-DD" defaultValue={dateRang} disabledDate={disabledDate} />
        </Form.Item>
      </Space>
    )
  }

  useEffect(() => {
    setCustview(< CustView v={Type} d={dateRang} l={aList}/>);
    return () => {
      setCustview(null)
    }
  }, [Type,areaListChoose ])
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Main>
        {exparams.sortA == 'a' ? <Mainbox>
          {dataList.map((item, index) => {
            return (<Titlelayout title={item.name} layout="flex" style={{ marginBottom: '16px', height: '520px' }} key={index}>
              <div className='chart'>
                <Ichart {...{ ...optionsRank, dataset: { ...dataset, source: item.consumeRank.slice(0, item.rankCount).reverse() } }} />
              </div>
            </Titlelayout>)
          })
          }
        </Mainbox> : <Mainbox>
          <Titlelayout title='设备能耗排名' layout="flex" style={{ width: '1072px', height: '800px' }} >
            <div className='chart1'>
              <Ichart {...optionsDevice} />
            </div>
          </Titlelayout>
        </Mainbox>}
        {exparams.sortA == 'a' ? <MainboxRight>
          {dataList.map((item, index) => {
            return (<Titlelayout title={item.name + '用能排行榜'} layout="flex" style={{ marginBottom: '16px', height: '520px' }} key={index}>
              <div className='chart'>
                {item.consumeRank.length > 0 ? item.consumeRank.slice(0, item.leaderboardCount).map((items, indexs) => {
                  return <div style={{
                    width: '548px', height: '72px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: '#f4f8ff', padding: '0 16px', marginBottom: '16px'
                  }} key={indexs}>
                    <img src={imgs[indexs]} style={{ width: '40px', height: '50px' }} />
                    <div>
                      <p>{items.name}</p>
                      <p>{items.value}</p>
                    </div>
                    <div>
                      <p>区域内占比</p>
                      <p>{items.percent}</p>
                    </div>
                  </div>
                }) : <Cempty />}
              </div>
            </Titlelayout>)
          })}
        </MainboxRight> : <MainboxRight>
          <Titlelayout title='设备用能排行榜' layout="flex" style={{ width: '580px', height: '800px' }} >
            <div className='chart'>
              {deviceList?.consumeRank?.length > 0 ? deviceList.consumeRank.slice(0, deviceList.leaderboardCount).map((items, indexs) => {
                return <div style={{
                  width: '548px', height: '72px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  backgroundColor: '#f4f8ff', padding: '0 16px', marginBottom: '16px'
                }} key={indexs}>
                  <img src={imgs[indexs]} style={{ width: '40px', height: '50px' }} />
                  <div>
                    <p>{items.name}</p>
                    <p>{items.value}</p>
                  </div>
                  <div>
                    <p>区域内占比</p>
                    <p>{items.percent}</p>
                  </div>
                </div>
              }) : <Cempty />}
            </div>
          </Titlelayout>
        </MainboxRight>}
      </Main>
    </Pagecount>
  )
}
