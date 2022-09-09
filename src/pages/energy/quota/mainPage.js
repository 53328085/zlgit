import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import { SearchOutlined } from '@ant-design/icons';
import { Select,Input, Button, Progress, Pagination } from 'antd';
import UseHeader from '@com/useHeader'
import { useNavigate } from 'react-router-dom';
import OtherPage from './otherPage'

export default function MainPage(props){
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

      const goback = ()=>{
        let display =true;
        props.sendToIndex(display);
      }

      return (
        <div>
            <UseHeader isbuilding={true} iscircle={true} isSearch={true}></UseHeader>
            <Button size="middle" className={style.goback} onClick={goback}>返回</Button>
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