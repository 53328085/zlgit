import React from 'react'
import style from './style.module.less'

export default function Firesolution(props) {
    const changePriceRecords = () => {
        
    }
    const changePrice = () => {
        
    }
    const editEvent = () => {
        
    }
    const deleteEvent = () => {
        
    }

  return (
    <div className={style.Solution}>
    <div className={style.solutionTitle}>
        {props.name ? props.name : '煤炭价方案'}
    </div>
    <div className={style.solutionBody}>
        <div className={style.boxes}>

            <div className={style.boxesTitle}>生效日期</div>
            <div className={style.boxesText}>{props.date ? props.date : '2022-05-15'}</div>

        </div>
        <div className={style.boxes}>
            <div className={style.boxesTitle}>电价类型</div>
            <div className={style.boxesText}>{props.type ? props.type : '阶梯费率'}</div>
        </div>
        <div className={style.boxes} style={{ width: 400 }}>
            <div className={style.boxesTitle}>{props.basePrice ? props.basePrice : ''}(元/度)</div>
            <div style={{ marginTop: 16 }}>
                <span>电价</span>
                <span style={{ paddingLeft: 60 }}>1.14</span>
            </div>
        </div>
        {
            props.priceType === 'step' ? (<div className={style.step}>
                <div className={style.column}>
                    <p style={{ fontWeight: 'bold' }}>阶梯值(kWh)</p>
                    <p className={style.mgtop}><span>第二档</span><span>230</span></p>
                    <p className={style.mgtop}><span>第三档</span><span>230</span></p>
                </div>
                <div className={style.column}>
                    <p style={{ fontWeight: 'bold' }}>阶梯值(kWh)</p>
                    <p className={style.mgtop}><span>第二档</span><span>230</span></p>
                    <p className={style.mgtop}><span>第三档</span><span>230</span></p>
                </div>
            </div>) : null

        }

        <div className={style.edit}>
            <div className={style.btns} onClick={changePriceRecords}>调价记录</div>
            <div className={style.btns} onClick={changePrice}>调价</div>
            <div className={style.btns} onClick={editEvent}>编辑</div>
            <div className={style.btns} onClick={deleteEvent} style={{ borderColor: '#ff0000', color: '#ff0000' }}>删除</div>
        </div>
    </div>
</div>
  )
}

