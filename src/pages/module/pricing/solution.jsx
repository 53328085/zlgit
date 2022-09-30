import React,{useState} from 'react'
import style from './style.module.less'
import {Modal} from 'antd'
import BlueColumn from '@com/bluecolumn'
export default function Solution(props) {
  const [isOpen,setIsOpen] = useState(false) 
  const [isEditOpen,setIsEditOpen] = useState(false)
  const changePriceRecords = ()=>{
    setIsOpen(true)
  }
  const changePrice = ()=>{}
  const editEvent =()=>{
    setIsEditOpen(true)
  }
  const deleteEvent = ()=>{}
  const ModalProps = {
    setIsOpen,
    isOpen
  }
  const ModalEditProps = {
    isEditOpen,
    setIsEditOpen
  }
  return (
    <div className={style.Solution}>
        <div className={style.solutionTitle}>
            {props.name?props.name:'电价方案'}
        </div>
        <div className={style.solutionBody}>
            <div className={style.boxes}>

                <div className={style.boxesTitle}>生效日期</div>
                <div className={style.boxesText}>{props.date?props.date:'2022-05-15'}</div>
              
            </div>
            <div className={style.boxes}>
                <div className={style.boxesTitle}>电价类型</div>
                <div className={style.boxesText}>{props.type?props.type:'阶梯费率'}</div>
            </div>
            <div className={style.boxes} style={{width: 400}}>
                <div className={style.boxesTitle}>{props.basePrice?props.basePrice:''}(元/度)</div>
                <div style={{marginTop:16}}>
                    <span>电价</span>
                    <span style={{paddingLeft:60}}>1.14</span>
                </div>
            </div>
            {
                props.isStep?(<div className={style.step}>
                <div className={style.column}>
                    <p style={{fontWeight:'bold'}}>阶梯值(kWh)</p>
                    <p className={style.mgtop}><span>第二档</span><span>230</span></p>
                    <p className={style.mgtop}><span>第三档</span><span>230</span></p>
                </div>
                <div className={style.column}>
                    <p style={{fontWeight:'bold'}}>阶梯值(kWh)</p>
                    <p className={style.mgtop}><span>第二档</span><span>230</span></p>
                    <p className={style.mgtop}><span>第三档</span><span>230</span></p>
                </div>
            </div>):null
                
            }
            
            <div className={style.edit}>
                <div className={style.btns} onClick={changePriceRecords}>调价记录</div>
                <div className={style.btns} onClick={changePrice}>调价</div>
                <div className={style.btns} onClick={editEvent}>编辑</div>
                <div className={style.btns} onClick={deleteEvent} style={{borderColor:'#ff0000',color:'#ff0000'}}>删除</div>
            </div>
        </div>
        
        <PriceRecordModal {...ModalProps}/>
        <EditModal {...ModalEditProps}/>
    </div>
  )
}
//调价记录modal
const PriceRecordModal = ({isOpen=false,setIsOpen})=>{
    function Card(){
        return (
            <div className={style.priceRecordCard}>
               <div className={style.polygon}><div style={{rotate:'-45deg',color:'#fff'}}>待启用</div></div>
                <div className={style.makeBrith}>
                    <div style={{fontWeight:'bold'}}>生效日期</div>
                    <div style={{fontWeight:'bold',marginTop:12}}>2022-05-06</div>
                </div>
                <div className={style.priceDetail}>
                    <div className={style.priceColumn}>
                        <div className={style.columnTitle}>基准电价(元/度)</div>
                        <div style={{marginTop:12,color:'#666'}}>
                            <span>基准电价</span>
                            <span>1.00</span>
                        </div>
                    </div>
                    <div className={style.priceColumn} style={{marginLeft:65}}>
                        <div className={style.columnTitle}>阶梯值(kWh)</div>
                        <div style={{marginTop:12,color:'#666'}}>
                            <span >第二档</span>
                            <span>230</span>
                        </div>
                        <div style={{marginTop:12,color:'#666'}}>
                            <span>第三档</span>
                            <span>200</span>
                        </div>
                    </div>
                    <div className={style.priceColumn} style={{marginLeft:65}}>
                        <div className={style.columnTitle}>阶梯电价(元/度)</div>
                        <div style={{paddingTop:12,color:'#666'}}>
                            <span >第二档</span>
                            <span>0.03</span>
                        </div>
                        <div style={{paddingTop:12,color:'#666'}}>
                            <span>第三档</span>
                            <span>0.35</span>
                        </div>
                    </div>
                </div>
                <div className={style.modalBtns}>
                    <div className={style.modalEdit}>编辑</div>
                    <div className={style.modalEdit +' '+ style.modalDel}>删除</div>
                </div>
            </div>
        )
    }
    return (
        <Modal 
        open={isOpen} 
        onCancel={()=>{setIsOpen(false)}}
        width={1440}
        title={<BlueColumn name="调价记录"/>}
        footer={null}
        >
           <Card/> 
           <Card/> 
           <Card/> 
        </Modal>
    )
}
//编辑
const EditModal = ({isEditOpen=false,setIsEditOpen})=>{
    return (
        <Modal 
        open={isEditOpen} 
        onCancel={()=>{setIsEditOpen(false)}}
        width={505}
        title={<BlueColumn name="调价记录"/>}
        
        >
           
        </Modal>
    )
} 