import React from 'react'
import  SelectForm from '@com/useSelect'
import style from './ranking.module.less'
import RankCharts from './rankecharts'
export default function Index() {
  
  return (
    <div className={style.ranking}>
      <SelectForm isset={false} ></SelectForm>
      <div className={style.ranklist}>
        <RankCharts name="按回路排名"/>
        <RankCharts name="按建筑排名"/>
        <RankCharts name="按房间排名"/>
      </div>
    </div>
  )
}
