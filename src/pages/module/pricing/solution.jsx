import React, { useState,Suspense } from 'react'
import style from './style.module.less'
import { Modal, Input, Form, DatePicker, Select, message } from 'antd'
import BlueColumn from '@com/bluecolumn'
import RedWarn from '@imgs/redwarn.png'
import { PriceSolution } from '@api/api.js'
import moment from 'moment';
import Loading from './Loading';
import { useEffect } from 'react'

const { Item } = Form
const { Option } = Select
export default function Solution(props) {
    const [isOpen, setIsOpen] = useState(false)
    const [isChangeOpen, setIsChangeOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [priceRecord, setPriceRecord] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    const getPriceSolution = async () => {
        const res = await PriceSolution.GetPriceSolution({ projectId: 1, solutionId: props.id })
        setIsLoading(false)
        if (res.success) {
            if (Array.isArray(res.data)) {
                setPriceRecord(res.data)
            }
        } else {
            res.errMsg ? message.error(res.errMsg) : message.error('调价记录查询失败')
        }
    }
    const pdl24 = {
        paddingLeft: 24
    }
    const pdl40 = {
        paddingLeft: 40
    }

    //调价记录
    const ModalProps = {
        setIsOpen,
        isOpen,
        priceRecord,
        isLoading,
        setIsLoading,
        ...props
    }
    //调价
    const ChangeProps = {
        isChangeOpen,
        setIsChangeOpen,
        ...props
    }
    //编辑
    const ModalEditProps = {
        isEditOpen,
        setIsEditOpen,
        ...props
    }
    //删除
    const DeleteProps = {
        isDeleteOpen,
        setIsDeleteOpen
    }
    const changePriceRecords = () => {
        setIsOpen(true)
        getPriceSolution()
        
    }
    const changePrice = () => {
        console.log(props)
        setIsChangeOpen(true)
    }
    const editEvent = () => {
        setIsEditOpen(true)
    }
    const deleteEvent = () => {
        setIsDeleteOpen(true)
    }
    return (
        <div className={style.Solution}>
            <div className={style.solutionTitle}>
                {props.name ? props.name : '电价方案'}
            </div>
            <div className={style.solutionBody}>
                <div className={style.boxes}>

                    <div className={style.boxesTitle}>生效日期</div>
                    <div className={style.boxesText}>{props.startDate.slice(0, 10) ? props.startDate.slice(0, 10) : ''}</div>

                </div>
                <div className={style.boxes}>
                    <div className={style.boxesTitle}>电价类型</div>
                    <div className={style.boxesText}>{props.priceTypeStr ? props.priceTypeStr : '单费率'}</div>
                </div>
                <div className={style.boxes} style={{ width: 400 }}>
                    <div className={style.boxesTitle}>{(props.priceType === 1 || props.priceType === 3) ? '基准价' : '复费率'}(元/度)</div>
                    {
                        (props.priceType === 1 || props.priceType === 3) ? <div style={{ marginTop: 16 }}>
                            <span>电价</span>
                            <span style={pdl24}>1.14</span>
                        </div> : (
                            <div className={style.step} style={{ borderRight: 'none' }}>
                                <div className={style.column} style={{ paddingLeft: 0 }}>

                                    <p className={style.mgtop}><span>尖</span><span style={pdl40}>{props.ratePrice.ratePrice1.toFixed(2)}</span></p>
                                    <p className={style.mgtop}><span>平</span><span style={pdl40}>{props.ratePrice.ratePrice3.toFixed(2)}</span></p>
                                </div>
                                <div className={style.column} style={{ paddingLeft: 0 }}>
                                    <p className={style.mgtop}><span>峰</span><span style={pdl40}>{props.ratePrice.ratePrice2.toFixed(2)}</span></p>
                                    <p className={style.mgtop}><span>谷</span><span style={pdl40}>{props.ratePrice.ratePrice4.toFixed(2)}</span></p>
                                </div>
                            </div>)
                    }
                </div>
                {
                    (props.priceType === 3 || props.priceType === 4) ? (<div className={style.step}>
                        <div className={style.column}>
                            <p style={{ fontWeight: 'bold' }}>阶梯值(kWh)</p>
                            <p className={style.mgtop}><span>第二档</span><span style={pdl40}>{props.tierPrice.tierValueMin2.toFixed(2)}</span></p>
                            <p className={style.mgtop}><span>第三档</span><span style={pdl40}>{props.tierPrice.tierValueMin3.toFixed(2)}</span></p>
                        </div>
                        <div className={style.column}>
                            <p style={{ fontWeight: 'bold' }}>阶梯价(元/度)</p>
                            <p className={style.mgtop}><span>第二档</span><span style={pdl40}>{props.tierPrice.tierPrice2.toFixed(2)}</span></p>
                            <p className={style.mgtop}><span>第三档</span><span style={pdl40}>{props.tierPrice.tierPrice3.toFixed(2)}</span></p>
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

            <PriceRecordModal {...ModalProps} />

           {isChangeOpen && <ChangePrice {...ChangeProps} />} 

           {isEditOpen && <EditModal  {...ModalEditProps}/>} 
            <DeleteModal {...DeleteProps} />
        </div>
    )
}
//调价记录
const PriceRecordModal = ({ isOpen = false, setIsOpen, priceRecord, ...otherprops }) => {
    const [editElectric, setEditElectric] = useState(false)
    const pdf40 = {
        paddingLeft: 30
    }

    function Card(props) {
        return (
            <div className={style.priceRecordCard}>
                <div className={`${style.polygon} ${props.enabled === '使用中' ? style.greenpolygon : style.graypolygon}`}><div style={{ rotate: '-45deg', color: '#fff' }}>{props.enabled}</div></div>
                <div className={style.makeBrith}>
                    <div style={{ fontWeight: 'bold' }}>生效日期</div>
                    <div style={{ fontWeight: 'bold', marginTop: 12 }}>{props.startDate.split(" ")[0]}</div>
                </div>
                <div className={style.priceDetail}>
                    <div className={style.priceColumn}>
                        <div className={style.columnTitle}>基准电价(元/度)</div>
                        <div style={{ marginTop: 12, color: '#666' }}>
                            <span>基准电价</span>
                            <span style={pdf40}>{props.benchmarkPrice}</span>
                        </div>
                    </div>
                    {
                        otherprops.priceType === 2 || otherprops.priceType === 4 ?
                            (
                                <>
                                    <div className={style.priceColumn} style={{ marginLeft: 65, borderLeft: '1px dashed #d7d7d7' }}>
                                        <div className={style.columnTitle}>复费率</div>
                                        <div style={{ marginTop: 12, color: '#666' }}>
                                            <span >尖单价(元)</span>
                                            <span style={pdf40}>{props.ratePrice.ratePrice1.toFixed(2)}</span>
                                        </div>
                                        <div style={{ marginTop: 12, color: '#666' }}>
                                            <span>平单价(元)</span>
                                            <span style={pdf40}>{props.ratePrice.ratePrice3.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className={style.priceColumn} style={{ marginLeft: 45 }}>
                                        {/* <div className={style.columnTitle}>阶梯电价(元/度)</div> */}
                                        <div style={{ paddingTop: 34, color: '#666' }}>
                                            <span >峰单价(元)</span>
                                            <span style={pdf40}>{props.ratePrice.ratePrice2.toFixed(2)}</span>
                                        </div>
                                        <div style={{ paddingTop: 12, color: '#666' }}>
                                            <span>谷单价(元)</span>
                                            <span style={pdf40}>{props.ratePrice.ratePrice4.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </>

                            ) : null
                    }
                    {
                        otherprops.priceType === 3 || otherprops.priceType === 4 ?
                            (<>
                                <div className={style.priceColumn} style={{ marginLeft: 45, borderLeft: '1px dashed #d7d7d7' }}>
                                    <div className={style.columnTitle}>阶梯值(kWh)</div>
                                    <div style={{ marginTop: 12, color: '#666' }}>
                                        <span >第二档</span>
                                        <span style={pdf40}>{props.tierPrice.tierValueMin2.toFixed(2)}</span>
                                    </div>
                                    <div style={{ marginTop: 12, color: '#666' }}>
                                        <span>第三档</span>
                                        <span style={pdf40}>{props.tierPrice.tierValueMin3.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className={style.priceColumn} style={{ marginLeft: 65 }}>
                                    <div className={style.columnTitle}>阶梯电价(元/度)</div>
                                    <div style={{ paddingTop: 12, color: '#666' }}>
                                        <span >第二档</span>
                                        <span style={pdf40}>{props.tierPrice.tierPrice2.toFixed(2)}</span>
                                    </div>
                                    <div style={{ paddingTop: 12, color: '#666' }}>
                                        <span>第三档</span>
                                        <span style={pdf40}>{props.tierPrice.tierPrice3.toFixed(2)}</span>
                                    </div>
                                </div>
                            </>) : null
                    }



                </div>
                <div className={style.modalBtns}>
                    <div className={style.modalEdit} onClick={() => { setEditElectric(true) }}>编辑</div>
                    <div className={style.modalEdit + ' ' + style.modalDel}>删除</div>
                </div>
            </div>
        )
    }
    return (
        <>
            <Modal
                centered
                open={isOpen}
                onCancel={() => { setIsOpen(false) }}
                width={1440}
                title={<BlueColumn name="调价记录" />}
                footer={null}
                bodyStyle={otherprops.isLoading?{minHeight:168,display:'flex',alignItems: 'center',justifyContent: 'center'}:{}}
            >
               {
                otherprops.isLoading?<Loading/>:(priceRecord.map((item, index) => <Card {...item} key={index} />))
               }
                    
              
               

            </Modal>
          {editElectric &&  <EditElectricModal editElectric={editElectric} setEditElectric={setEditElectric} {...otherprops} />} 
        </>


    )
}
//编辑电价
const EditElectricModal = ({ editElectric,setEditElectric,priceType, ...otherprops }) => {
    const [form] = Form.useForm()
    const labcol1 = { span: 4, offset: 0 };
    const labcol2 = { span: 5, offset: 0 }
    const inpStyle1 = {
        width: 112,
        marginLeft: 60,
    }
    const inpStyle2 = {
        width: 112,
        marginLeft: 39
    }
    const itemStyle = {
        paddingBottom: 16,
        borderBottom: '1px dashed #d7d7d7'
    }

    const initFormData = {
        Electric: priceType.toString(),
        BasePrice: otherprops.benchmarkPrice,
        Tip: otherprops.ratePrice.ratePrice1,
        Peak: otherprops.ratePrice.ratePrice2,
        Plain: otherprops.ratePrice.ratePrice3,
        Valley: otherprops.ratePrice.ratePrice4,
        tierValueMin2: otherprops.tierPrice.tierValueMin2,
        tierValueMin3: otherprops.tierPrice.tierValueMin3,
        tierPrice2: otherprops.tierPrice.tierPrice2,
        tierPrice3: otherprops.tierPrice.tierPrice3,
        Birth: moment(otherprops.startDate)
    }
    const BasePrice = (
        <Item label={<strong>基准价(元/度)</strong>} name="BasePrice" style={priceType !== 1 ? itemStyle : {}}>
            <Input style={{ width: 112 }}></Input>
        </Item>)

    return (
        <Modal
            centered
            destroyOnClose
            zIndex={1001}
            width={priceType === 4 ? 1114 : 614}
            forceRender={true}
            closable={false}
            open={editElectric}
            title={<BlueColumn name="编辑电价" />}
            onCancel={() => { setEditElectric(false); }}
            cancelButtonProps={{ style: { width: 96, height: 36, fontSize: 14 } }}
            onOk={() => { console.log(form.getFieldValue()) }}
            okButtonProps={{ style: { width: 96, height: 36, fontSize: 14 } }}
        >
            <div style={priceType === 4 ? { display: 'flex', borderBottom: '1px dashed #d7d7d7' } : {}}>
                <Form
                    labelCol={priceType !== 2 ? labcol2 : labcol1}
                    labelAlign="left"
                    size="middle"
                    preserve={true}
                    form={form}
                    initialValues={initFormData}
                    className={style.addPlanForm}
                >
                    <Item label={<strong>电价类型</strong>} style={{ paddingTop: 16, borderTop: '1px dashed #d7d7d7' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Item noStyle name="Electric">
                                <Select style={{ width: 112 }} >
                                    <Option value="1">单费率</Option>
                                    <Option value="2">复费率</Option>
                                    <Option value="3">阶梯费率</Option>
                                    <Option value="4">混合费率</Option>
                                </Select>
                            </Item>
                        </div>

                    </Item>
                    {priceType !== 2 ? BasePrice : null}
                    {
                        (priceType === 2 || priceType === 4) ?
                            <Item style={{ borderBottom: '1px dashed #d7d7d7' }}>
                                <div style={{ alignItems: 'center', borderTop: priceType === 2 ? '1px dashed #d7d7d7' : '', paddingTop: priceType === 2 ? 16 : '' }}>
                                    <strong style={{ marginRight: 105 }}>复费率(元/度)</strong>
                                    <div className={style.flexContainer} style={{ marginTop: 16 }}>
                                        <Item label="尖电价" labelCol={5} name="Tip"><Input style={{...inpStyle2,marginLeft:priceType === 4?65:39}} /></Item>
                                        <Item label="峰电价" labelCol={5} name="Peak"><Input style={{ width: 112  }} /></Item>
                                    </div>
                                    <div className={style.flexContainer}>
                                        <Item label="平电价" labelCol={5} name="Plain"><Input style={{...inpStyle2,marginLeft:priceType === 4?65:39}} /></Item>
                                        <Item label="谷电价" labelCol={5} name="Valley"><Input style={{ width: 112 }} /></Item>
                                    </div>
                                </div>
                            </Item> : null
                    }
                    {(priceType === 3 || priceType === 4) ? (
                        <>
                            <Item style={{ ...itemStyle, paddingBottom: 0 }}>
                                <div style={{ display: 'flex', }}>
                                    <div style={{ width: 288 }}>
                                        <strong style={{ marginBottom: 16 }}>阶梯值(kWh)</strong>
                                        <Item name="tierValueMin2" label="第二档" style={{ marginTop: 16 }}>
                                            <Input style={inpStyle1} size="default"></Input>
                                        </Item>
                                        <Item name="tierValueMin3" label="第三档">
                                            <Input style={inpStyle1} size="default"></Input>
                                        </Item>
                                    </div>
                                    <div style={{ width: 288 }}>
                                        <strong >阶梯价(元/度)</strong>
                                        <Item name="tierPrice2" label="第二档" style={{ marginTop: 16 }}>
                                            <Input style={{ width: 112 }} size="default"></Input>
                                        </Item>
                                        <Item name="tierPrice3" label="第三档">

                                            <Input style={{ width: 112 }} size="default"></Input>
                                        </Item>
                                    </div>
                                </div>
                            </Item>
                        </>
                    ) : null
                    }

                    <Item label={<strong>生效日期</strong>}  name="Birth" style={priceType !== 4 ? itemStyle : {}}>
                        <DatePicker style={{ width: 112 }} suffixIcon={null}></DatePicker>
                    </Item>
                </Form>
                {
                    priceType === 4 ? (<div style={{ marginLeft: 64, backgroundColor: '#f2f2f2', borderRadius: 4, padding: 16, width: 472, marginBottom: 16 }}>
                        <strong style={{ fontSize: 16 }}>计算公式：</strong>
                        <p style={{ marginTop: 16 }}>总电量＝峰时段电量+平时段电量+谷时段电量</p>
                        <p style={{ marginTop: 16 }}>总电费＝分时电费＋第二档增量电费＋第三档增量电费</p>
                        <p style={{ marginTop: 16 }}>分时电费＝峰时段电量×峰时段电价+平时段电量×平时段电价+谷时段电量×谷时段电价</p>
                        <p style={{ marginTop: 16 }}>第二档增量电费＝第二档用电量×第二档加价标准</p>
                        <p style={{ marginTop: 16 }}>第三档增量电费＝第三档用电量×第三档加价标准</p>
                        <p style={{ marginTop: 16 }}>"电费先分时后阶梯”即先按照峰谷各时段用电量和分时电价标准计算全部电量的电费，再按照第二档、第三档递增电价标准，分别计算第二档、第三档电量的递增电费，三部分电费之和即为该居民用户的总电费。</p>
                        <p style={{ marginTop: 16 }}> 阶梯式电价是阶梯式递增电价或阶梯式累进电价的简称，也称为阶梯电价，是指把户均用电量设置为若干个阶梯分段或分档次定价计算费用。</p>

                    </div>) : null
                }
            </div>


        </Modal>
    )
}
//调价
const ChangePrice = ({ isChangeOpen, setIsChangeOpen, priceType, ...otherprops }) => {
    const [form] = Form.useForm()
    const labcol1 = { span: 4, offset: 0 };
    const labcol2 = { span: 5, offset: 0 }
    console.log(priceType)
    const inpStyle1 = {
        width: 112,
        marginLeft: 60,
    }
    const inpStyle2 = {
        width: 112,
        marginLeft: 39
    }
    const itemStyle = {
        paddingBottom: 16,
        borderBottom: '1px dashed #d7d7d7'
    }

    const initFormData = {
        Electric:priceType.toString() ,
        BasePrice: otherprops.benchmarkPrice,
        Tip: otherprops.ratePrice.ratePrice1,
        Peak: otherprops.ratePrice.ratePrice2,
        Plain: otherprops.ratePrice.ratePrice3,
        Valley: otherprops.ratePrice.ratePrice4,
        tierValueMin2: otherprops.tierPrice.tierValueMin2,
        tierValueMin3: otherprops.tierPrice.tierValueMin3,
        tierPrice2: otherprops.tierPrice.tierPrice2,
        tierPrice3: otherprops.tierPrice.tierPrice3,
        Birth: moment(otherprops.startDate)
    }
    const BasePrice = (
        <Item label={<strong>基准价(元/度)</strong>} name="BasePrice" style={priceType !== 1 ? itemStyle : {}}>
            <Input style={{ width: 112 }}></Input>
        </Item>)

    return (
        <Modal
            centered
            destroyOnClose
            width={priceType === 4 ? 1114 : 614}
            forceRender={true}
            closable={false}
            open={isChangeOpen}
            title={<BlueColumn name="定价方案" />}
            onCancel={() => { setIsChangeOpen(false); }}
            cancelButtonProps={{ style: { width: 96, height: 36, fontSize: 14 } }}
            onOk={() => { console.log(form.getFieldValue()) }}
            okButtonProps={{ style: { width: 96, height: 36, fontSize: 14 } }}
        >
            <div style={priceType === 4 ? { display: 'flex', borderBottom: '1px dashed #d7d7d7' } : {}}>
                <Form
                    labelCol={priceType !== 2 ? labcol2 : labcol1}
                    labelAlign="left"
                    size="middle"
                    preserve={true}
                    form={form}
                    initialValues={initFormData}
                    className={style.addPlanForm}
                >
                    <Item label={<strong>电价类型</strong>} style={{ paddingTop: 16, borderTop: '1px dashed #d7d7d7' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Item noStyle name="Electric">
                                <Select style={{ width: 112 }} disabled>
                                    <Option value="1">单费率</Option>
                                    <Option value="2">复费率</Option>
                                    <Option value="3">阶梯费率</Option>
                                    <Option value="4">混合费率</Option>
                                </Select>
                            </Item>
                        </div>

                    </Item>
                    {priceType !== 2 ? BasePrice : null}
                    {
                        (priceType === 2 || priceType === 4) ?
                            <Item style={{ borderBottom: '1px dashed #d7d7d7' }}>
                                <div style={{ alignItems: 'center', borderTop: priceType === 2 ? '1px dashed #d7d7d7' : '', paddingTop: priceType === 2 ? 16 : '' }}>
                                    <strong style={{ marginRight: 105 }}>复费率(元/度)</strong>
                                    <div className={style.flexContainer} style={{ marginTop: 16 }}>
                                        <Item label="尖电价" labelCol={5} name="Tip"><Input style={{...inpStyle2,marginLeft:priceType === 4?65:39}} /></Item>
                                        <Item label="峰电价" labelCol={5} name="Peak"><Input style={{ width: 112 }} /></Item>
                                    </div>
                                    <div className={style.flexContainer}>
                                        <Item label="平电价" labelCol={5} name="Plain"><Input style={{...inpStyle2,marginLeft:priceType === 4?65:39}} /></Item>
                                        <Item label="谷电价" labelCol={5} name="Valley"><Input style={{ width: 112}} /></Item>
                                    </div>
                                </div>
                            </Item> : null
                    }
                    {(priceType === 3 || priceType === 4) ? (
                        <>
                            <Item style={{ ...itemStyle, paddingBottom: 0 }}>
                                <div style={{ display: 'flex', }}>
                                    <div style={{ width: 288 }}>
                                        <strong style={{ marginBottom: 16 }}>阶梯值(kWh)</strong>
                                        <Item name="tierValueMin2" label="第二档" style={{ marginTop: 16 }}>
                                            <Input style={inpStyle1} size="default"></Input>
                                        </Item>
                                        <Item name="tierValueMin3" label="第三档">
                                            <Input style={inpStyle1} size="default"></Input>
                                        </Item>
                                    </div>
                                    <div style={{ width: 288 }}>
                                        <strong >阶梯价(元/度)</strong>
                                        <Item name="tierPrice2" label="第二档" style={{ marginTop: 16 }}>
                                            <Input style={{ width: 112 }} size="default"></Input>
                                        </Item>
                                        <Item name="tierPrice3" label="第三档">

                                            <Input style={{ width: 112 }} size="default"></Input>
                                        </Item>
                                    </div>
                                </div>
                            </Item>
                        </>
                    ) : null
                    }

                    <Item label={<strong>生效日期</strong>} name="Birth" style={priceType !== 4 ? itemStyle : {}}>
                        <DatePicker style={{ width: 112 }} suffixIcon={null}></DatePicker>
                    </Item>
                </Form>
                {
                    priceType === 4 ? (<div style={{ marginLeft: 64, backgroundColor: '#f2f2f2', borderRadius: 4, padding: 16, width: 472, marginBottom: 16 }}>
                        <strong style={{ fontSize: 16 }}>计算公式：</strong>
                        <p style={{ marginTop: 16 }}>总电量＝峰时段电量+平时段电量+谷时段电量</p>
                        <p style={{ marginTop: 16 }}>总电费＝分时电费＋第二档增量电费＋第三档增量电费</p>
                        <p style={{ marginTop: 16 }}>分时电费＝峰时段电量×峰时段电价+平时段电量×平时段电价+谷时段电量×谷时段电价</p>
                        <p style={{ marginTop: 16 }}>第二档增量电费＝第二档用电量×第二档加价标准</p>
                        <p style={{ marginTop: 16 }}>第三档增量电费＝第三档用电量×第三档加价标准</p>
                        <p style={{ marginTop: 16 }}>"电费先分时后阶梯”即先按照峰谷各时段用电量和分时电价标准计算全部电量的电费，再按照第二档、第三档递增电价标准，分别计算第二档、第三档电量的递增电费，三部分电费之和即为该居民用户的总电费。</p>
                        <p style={{ marginTop: 16 }}> 阶梯式电价是阶梯式递增电价或阶梯式累进电价的简称，也称为阶梯电价，是指把户均用电量设置为若干个阶梯分段或分档次定价计算费用。</p>

                    </div>) : null
                }
            </div>


        </Modal>
    )
}

//编辑
const EditModal = ({ isEditOpen = false, setIsEditOpen, ...otherprops }) => {
    const [planName, setPlanName] = useState(otherprops.name)

    const UpdatePriceSolutionName = async () => {
        const res = await PriceSolution.UpdatePriceSolutionName({
            projectId: 1,
            solutionId: otherprops.id,
            solutionName: planName
        })
        if (res.success) {
            otherprops.getPriceSolution()
            message.success('编辑方案名称成功!')
        } else {
            message.error('编辑方案名称失败!')
        }
    }
    const InpChange = (e) => {
        setPlanName(e.target.value)
    }

    const ConfirmEdit = () => {
        UpdatePriceSolutionName();
        setIsEditOpen(false)
    }
    return (
        <Modal
            centered
            open={isEditOpen}
            onCancel={() => { setIsEditOpen(false) }}
            onOk={ConfirmEdit}
            width={505}
            title={<BlueColumn name="编辑定价方案" />}
            closable={false}
            okButtonProps={{ style: { width: 96, height: 36 }, size: 'default' }}
            cancelButtonProps={{ style: { width: 96, height: 36 }, size: 'default' }}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ flexShrink: 0, paddingRight: 16 }}>方案名称</span>
                <Input size='default' onChange={InpChange} value={planName}></Input>
            </div>
        </Modal>
    )
}
//删除
const DeleteModal = ({ isDeleteOpen, setIsDeleteOpen }) => {
    return (
        <Modal
            centered
            open={isDeleteOpen}
            closable={false}
            onCancel={() => { setIsDeleteOpen(false) }}
            title={<BlueColumn name="编辑定价方案" bg={{ backgroundColor: '#ff5b5b', }} styled={{ color: '#ff5b5b' }} />}
            okButtonProps={{ className: style.OkBtnStyle, size: 'default' }}
            cancelButtonProps={{ className: style.CanCelStyle, size: 'default' }}
        >
            <div style={{}}>
                <img src={RedWarn} alt="" style={{ width: 56, height: 50, margin: '0 30px' }} />
                <span style={{ fontSize: 16 }}>确认是否要删除定价方案?</span>
            </div>
        </Modal>
    )
}

