import { Form,  Select, Input,Slider, Radio, InputNumber, TimePicker, Typography, Tag, Space} from 'antd'
import {DeleteOutlined} from '@ant-design/icons'
import {CSlider,Scene,CTag} from './style'
import imgsrc from "@svgs/index"
import {CustButton} from "@com/useButton"
const  {Link} = Typography
export const cols =[ //  
    {
      title: '方案名称',
      dataIndex: 'strategyName', 
      key:'strategyName',
    },
    {
      title: '场景',
      dataIndex: 'sceneDesc', 
      key:'sceneDesc',
    },
    {
      title: '绑定路灯数',
      dataIndex: 'bindLightNum', 
      key:'bindLightNum',
    },
    {
      title: '创建人',
      dataIndex: 'creater', 
      key:'creater',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime', 
      key:'createTime',
    },
     
  ]
  export const rules =[{
    required: true
  }]
 const w255= {width: "255px"}    //0：道路灯 1：高杆路灯 2：太阳能路灯 3：景观灯
 const options =[
    {label: "全夜灯", value: "全夜灯"},
    {label: "半夜等", value: "半夜等"},
    {label: "景观灯", value: "景观灯"},
    {label: "泛光灯", value: "泛光灯"},
  ]
  const timeType = [
    {label: "日出前", value: "日出前"},
    {label: "日出后", value: "日出后"},
    {label: "日落前", value: "日落前"},
    {label: "日落后", value: "日落后"},
  ]
  export const items =(
    <>
    <Form.Item label="方案名称" name="schemeName" rules={rules}>
        <Input placeholder='请输入' style={w255}></Input>          
    </Form.Item>
    <Form.List name="scenes" initialValue={[{}]}>
      {
        (fileds, {add, remove})=> (
          <Scene>
          {
          fileds.map((field,_,arr) =>  (
                  <Form.List name={[field.name, "tasks"]} initialValue={[{}]}>
                 {
                  (inerfileds, inmethods)=>{ 
                    return(
                    <div className='scene' key={field.key} >
                      <div  className='hander'>
                        <div className='list'>
                        <Form.Item label={`场景${new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec").format(field.name + 1)}`}  rules={rules} name={[field.name,"sceneName"]} >
                            <Select options={options} style={{width: "200px"}}></Select> 
                        </Form.Item>
                        <div className='tags'>
                         {
                          inerfileds?.map((i, idx, arr) => {
                            console.log(i)
                            return <CTag key={i.key}   closable={arr.length!==1} onClose={()=> inmethods.remove(i.name)}>时间点{idx + 1}</CTag>
                          })
                         }
                         </div>
                         </div>
                        <Link disabled={inerfileds?.length >3} onClick={()=> inmethods.add()}>添加时间点</Link>
                      </div>
                      <div className='contents'>
                      {
                        inerfileds?.map?.((inerfiled, index, arr) => (
                            <div  className='content'  key={inerfiled.key} >
                            
                          <Form.Item label="定时任务" name={[inerfiled.name,"taskType"]}  initialValue={0}>
                            <Radio.Group>
                            <Radio value={0}>开</Radio>
                            <Radio value={1}>关</Radio>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item label="时间点设置" name={[inerfiled.name,"timeType"]} initialValue={0}>
                            <Radio.Group>
                            <Radio value={0}>相对值</Radio>
                            <Radio value={1}>固定值</Radio>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item label="时间点" shouldUpdate={(cur, pre)=>{
                            console.log(cur)
                            console.log(cur["scenes"]?.[field.name]?.["tasks"]?.[inerfiled.name]?.timeType)
                            return cur["scenes"]?.[field.name]?.["tasks"]?.[inerfiled.name]?.timeType!=pre["scenes"]?.[field.name]?.["tasks"]?.[inerfiled.name]?.timeType
                            } }>
                            {
                              ({getFieldValue})=> {
                                let type = getFieldValue(["scenes", field.name])?.["tasks"]?.[inerfiled.name]?.timeType
                                console.log(type)
                                if(type==0) {
                                  return (
                                    <Space>
                                    <Form.Item name={[inerfiled.name,"excueTime"]} rules={rules}>
                                       <Select options={timeType} style={{width: "200px"}}></Select>
                                    </Form.Item>
                                    <Form.Item name={[inerfiled.name,"timing"]} rules={rules}>
                                      <InputNumber min={0} max={60} precision={0}></InputNumber>
                                    </Form.Item>
                                   </Space>
                                  )
                                }else {
                                  return <Form.Item name={[inerfiled.name,"excueTime"]} rules={rules}>
                                     <TimePicker format="HH:mm"/>
                                  </Form.Item>
                                }
                              }
                            }
                          </Form.Item>
                          <Form.Item label="亮度设置">
                          <div style={{position: "relative", width: "450px",}}> 
                              <img src={imgsrc["light"]} style={{position: "absolute"}} />
                              <Form.Item  name={[inerfiled.name,"brightness"]} noStyle >
                                <CSlider  />
                              </Form.Item>
                            </div> 
                          </Form.Item>
                          </div>
                          )
                        )
                      }
                      </div>
                     {arr.length > 1 && <img src={imgsrc["del"]} onClick={()=> remove(field.name)} className='del' /> }
                    </div>
                  ) }
                 }
               </Form.List>
            )
         )
           }
           <Form.Item>
             <div style={{display: "flex", justifyContent: "center"}}>
             <CustButton onClick={()=> add()}>添加场景</CustButton>
            </div> 
           </Form.Item>
          </Scene>
        )
      } 
    </Form.List>
    <Form.Item name="id" initialValue={0} noStyle><Input hidden /></Form.Item>
    </>
  )