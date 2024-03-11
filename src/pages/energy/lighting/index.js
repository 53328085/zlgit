import React, {useState, useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import {useAntdTable, usePagination} from 'ahooks'
import {Form, Image, Select, Input, Button, Divider} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import Pagecount from '@com/pagecontent'
import {selectCurProject} from '@redux/user.js'
import CustContext from '@com/content.js'
import styled from 'styled-components'
import Custcard from '@com/titlelayout'
import {drawEcharts} from '@com/useEcharts'
import Custtable from '@com/useTable'
import lingth from './icon/comlingth.png'
import {Serach, Cdivider} from "@com/comstyled"
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 992px 672px;
  grid-template-rows: 1fr;
  column-gap: 16px;
  .left {
     display: grid;
     grid-template-rows: 128px 656px;
     row-gap: 16px;
     .leftup {
        display: grid;
        grid-template-columns: repeat(3, 320px);
        column-gap: 16px;

     }
  }
`
const Cardmain = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`
const Contrmain = styled.div`
  height: 100%;
  padding: 16px 0;
  display: grid;
  grid-template-rows: 32px 1px 32px 1fr;
  row-gap: 16px;
 
`
const CustBtn = styled(Button)`
  width: ${(props) => props.width || "96px"};
  height: 32px;
  background-color: ${(props) => props.bgColor};
  border-color: #0066cc;
  color: ${props => props.textColor};
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top:0px;
  padding-bottom: 0px;
  .anticon + span {
    margin-left: ${(props) => props.mgl || "16px"};
  }
  &:hover, &:active, &:focus  {
    background-color: ${(props) => props.bgColor=="#fff" ? "#fff" : props.bgColor};
    color: ${(props) => props.bgColor=="#fff" ? props.textColor : "#fff"};
  } 
`;
CustBtn.defaultProps = {
    bgColor: "#237ae4",
    textColor: "#fff"
}
const CutSerachBt = styled(CustBtn)`
  .anticon + span {
    margin-left: 8px;
  }
  font-size: 14px;
  color:#fff !important;
  border:none;
/*   &:hover, &:focus {
    background-color: #0033ff;
    border-color: none;
  } */
`;
export default function Index() {
  const [form] = Form.useForm()

  //const [formparams, setFormparams] = useState(form.getFieldsValue())
 // const [value, setvalue] = useState('electric')
  const projectId = useSelector(selectCurProject)?.id 

  const carddata = [
    {
        title: '公共照明数量(个)',
        num: 125,
        add: null,
        bgcolor: "#009966",
        id: 1
    },
    {
        title: '本月公共照明能耗(kwh)',
        num: 125,
        add: 2.54,
        id: 2,
        bgcolor: "#3366ff",
    },
    {
        title: '本年公共照明能耗(kwh)',
        num: 800,
        add: 2.54,
        id: 3,
        bgcolor: "#3333cc",
    }
  ]

  const Cards = ({title, num, add,  bgcolor,}) => {
    return (
        <Custcard title={title} bgcolor={bgcolor} hv="24px" fc="#fff" bl="4px solid #fff">
          <Cardmain>
             <Image src={lingth} preview={false} />
             <div style={{color: "#fff", textAlign: "center"}}>
                <p style={{lineHeight: 1.2, fontSize: "28px"}}> {num}</p>
                {add && <span>同比&nbsp;&nbsp;&nbsp;+{add}%</span> }
             </div>
          </Cardmain>
        </Custcard>
    )
     
  }

  const datasetMonth = {
    dimensions: ["time", "用电量"],
    source: [
      { time: "9-1", "用电量": 5600 },
      { time: "9-2", "用电量": 4600 },
      { time: "9-3", "用电量": 3600 },
      { time: "9-4", "用电量": 5611 },
      { time: "9-5", "用电量": 5644 },
      { time: "9-6", "用电量": 4677 },
      { time: "9-7", "用电量": 3688 },
      { time: "9-8", "用电量": 5088 },
      { time: "9-9", "用电量": 6677 },
      { time: "9-10", "用电量": 5866 },
      { time: "9-11", "用电量": 4677 },
      { time: "9-12", "用电量": 1877 },
    ],
  };
  const datasetYear = {
    dimensions: ["time", "本年用电量"],
    source: [
      { time: "1月", "本年用电量": 56000 },
      { time: "2月", "本年用电量": 46000 },
      { time: "3月", "本年用电量": 36000},
      { time: "4月", "本年用电量": 56000 },
      { time: "5月", "本年用电量": 56000 },
      { time: "6月", "本年用电量": 46000 },
      { time: "7月", "本年用电量": 36000 },
      { time: "8月", "本年用电量": 50000 },
      { time: "9月", "本年用电量": 66000 },
      { time: "10月", "本年用电量": 58000 },
      { time: "11月", "本年用电量": 46000 },
      { time: "12月", "本年用电量": 18000 },
    ],
  };
  const ref = useRef()
  const [dataset, setDataset] = useState(datasetMonth);
  const [time, setTime] = useState('Month')
  const changetiem = (e) => {
     setTime(e)
    let chartData = e == 'Month' ? datasetMonth : datasetYear
    setDataset(data => ({...data, ...chartData }) )
  }
  useEffect(() => {
    drawEcharts(ref.current, {
        dataset,
        series: [{ type: "bar" }]
    })
  }, [dataset])
  const Ymselect = () => {
    return (
        <Select value={time} onChange={changetiem} size="middle" style={{width: '96px'}}>
            <Select.Option value="Month">月</Select.Option>
            <Select.Option value="Year">年</Select.Option>
        </Select>
    )
  }


  const propsData ={   
    form,
  }
  const submit = () => {}
  const columns = [
    {
      dataIndex: "deviceId",
      title: "设备编号",
    },
    {
      dataIndex: "address",
      title: "安装地址",
    },{
        dataIndex: "state",
        title: "状态",
        render: (text) => text ? '开启' : '关闭',
      }
  ]
  const dataSource = [
    {
        deviceId: 'NB00101',
        address: '正泰物联滨江园区',
        state: true,
        id:1
    },
    {
        deviceId: 'NB00102',
        address: '正泰物联滨江园区',
        state: true,
        id: 2
    },
    {
        deviceId: 'NB00103',
        address: '正泰物联滨江园区',
        state: false,
        id: 3
    }
  ]
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={true} bgcolor="transparent">   
        <Mainbox>
            <div className='left'>
                <div className="leftup">
                  {carddata.map(c => <Cards {...c} key={c.id}></Cards>)}  
                </div>
                <Custcard title="公共照明能耗" extra={<Ymselect/>}>
                    <div ref={ref} style={{height: '100%'}}></div>
                </Custcard>
            </div>
            <Custcard title="公共照明批量控制" >
                <Contrmain>
                    <Serach placeholder='请输入设备编号/安装地址'   style={{width: '356px'}} onSearch={submit} />
                   
                    <Cdivider type="h" style={{margin: '0px'}} />
                     <div style={{display: 'flex', justifyContent: "space-between"}}>
                        <CustBtn width="124px">自动控制</CustBtn>
                        <div style={{display: "flex"}}>
                           <CustBtn  style={{marginRight: '16px'}} bgColor="#fff" textColor="#237Ae4">手动开启</CustBtn>
                           <CustBtn bgColor="#fff" textColor="#237Ae4">手动关闭</CustBtn>
                        </div>
                       
                     </div>
                     <Custtable columns={columns} dataSource={dataSource} rowKey="id" rowSelection={rowSelection}></Custtable>
                </Contrmain>
            </Custcard>
        </Mainbox>
     
    </Pagecount>
    </CustContext.Provider>
  )
}
