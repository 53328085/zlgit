import React, {useState, useEffect} from 'react'
import style from './style.module.less';
import { SearchOutlined } from '@ant-design/icons';
import { Select,Input, Button, Progress, Pagination } from 'antd';
import UseHeader from '@com/useHeader'
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const {Option} = Select
  const navigate = useNavigate();


  let cardList = [{
    Address:'正泰物联滨江园区-研发1号楼-1层-101',
    Status:'Normal',
    QuotaEnergy:'2.00',
    UsedEnergy:'1.00',
    SurEnergy:'1.00',
    Percent: 75
  }]
  for(let i = 0;i<11;i++){
    cardList.push(cardList[0]);
  }


  const toRoomDetail = (item) =>{
    // navigate('/roomDetail')
    console.log(item);
    window.open('/roomDetail','_blank')
  }

  return (
    <div>
      {/* <div className={style.header}>
        <span style={{marginLeft: '12px'}}>园区选择</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          style={{width: '320px', marginLeft: '12px'}}
        >
          <Option value="1">正泰物联全部园区</Option>
          <Option value="2">正泰物联滨江园区</Option>
          <Option value="3">正泰物联温州园区</Option>
        </Select>
        <div className={style.line}></div>
        <Select
          placeholder="请选择建筑物"
          size="middle"
          style={{width: '224px'}}
        >
          <Option value="0">全部建筑物</Option>
          <Option value="1">研发1号楼</Option>
          <Option value="2">研发2号楼</Option>
          <Option value="3">行政楼</Option>
        </Select>
        <Select
          placeholder="请选择楼层"
          size="middle"
          style={{width: '128px', marginLeft: '12px'}}
        >
          <Option value="0">全部楼层</Option>
          <Option value="1">1F</Option>
          <Option value="2">2F</Option>
          <Option value="3">3F</Option>
        </Select>
        <div className={style.line}></div>
        <span>周期</span>
        <Select
          placeholder="请选择楼层"
          size="middle"
          style={{width: '96px', marginLeft: '12px'}}
        >
          <Option value="0">月度</Option>
          <Option value="1">季度</Option>
          <Option value="2">年度</Option>
        </Select>
        <div className={style.line}></div>
        <div className={style.search}>
          <Input size="middle" placeholder='请输入房间号' style={{width:'260px'}} />
          <Button type='primary' size="middle" icon={<SearchOutlined />}>查询</Button>
        </div>
      </div> */}
      <UseHeader></UseHeader>
      <div style={{paddingTop: '12px',display:'flex',flexWrap:'wrap'}}>
        { cardList.map((item, index) => {
        return <div className={style.card} key={index} onClick={() => toRoomDetail(item)}>
          <div className={style.cardTop}>
            <span>{item.Address}</span>
            <span className={style.energyState}>{item.Status == 'Normal' ?'能耗正常':'能耗异常'}</span>
          </div>
          <div className={style.cardMiddle}>
            <img src={require('./img/bg.png')} style={{width:'60px',height:'60px',marginLeft:'12px'}} />
            <div className={style.energyType}>
              <div className={style.energyItem}>
                <span className={style.energytitle}>定额能耗</span>
                <span className={style.energyData}>{item.QuotaEnergy}</span>
              </div>
              <div className={style.energyItem}>
                <span className={style.energytitle}>已用能耗</span>
                <span className={style.energyData}>{item.UsedEnergy}</span>
              </div>
              <div className={style.energyItem}>
                <span className={style.energytitle}>剩余能耗</span>
                <span className={style.energyData}>{item.SurEnergy}</span>
              </div>
            </div>
          </div>
          <div className={style.cardBottom}>
            <span>(吨标煤)</span>
            <span className={style.percent}>能耗剩余</span>
            <Progress style={{width:'280px'}} percent={item.Percent} trailColor='#ebeef5' strokeWidth={20} />
          </div>
          
        </div>
      }) }
      </div>
      <Pagination style={{display:'flex',justifyContent:'flex-end', margin:'12px'}} size="small"  total={50} />
    </div>
  )
}