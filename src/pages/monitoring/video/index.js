import React, { useState, useEffect } from 'react'
import { Form, Select, Modal,Collapse,DatePicker,Radio,Button   } from 'antd'
import Header from './header'
import VideoList from './videolist'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import cameraBG from '@imgs/carmeraBG.png'
import EZUIKit from "ezuikit-js";
import moment from 'moment';
import {themeData} from './themeData'
export default function Index() {
  const { Panel } = Collapse;
  const {Item} =Form
  const [form] = Form.useForm();
  const [isModal, setisModal] = useState(false)
  const [play,setplay] =useState('') //小屏监控实例
  const [bigplay,setbigplay] =useState('')
  const [disabledendDate,setdisabledendDate] = useState(()=>(current=> current && current>moment().endOf('day')))
  const controlStyle= {
    width: 256,
    height: 256,
    margin: '0 auto',
    backgroundImage: `url(${cameraBG})`
  }
  const tags ={
    width:'50%',
    textAlign: 'center',
  }
  const buttonstyle = {
    width:'120px',
  }
  const disabledDate  = current=> current && current>moment().endOf('day')
  const changestartdate=(val)=>{
    setdisabledendDate(()=>(current=> current &&(current<val.endOf('day')|| current>moment().endOf('day'))))
  }
  console.log('disabledendDate',disabledendDate)
 //打开视频监控弹窗
  const showModal = () => {
    setisModal(true)
    play.stop()
    let player
    setTimeout(()=>{
      player= new EZUIKit.EZUIKitPlayer({
        id: 'replay',
        accessToken: 'at.9cl77yip98abfs927jrhscoj8cagttcz-9nyz8ow4cj-1e2lldl-xfyg9vtih',
        url: "ezopen://open.ys7.com/G88471891/1.hd.live",
        width: 1280, 
        height: 717,
        themeData:themeData,
      })
    setbigplay(player)
    },0)
  }
  //关闭视频监控弹窗
  const handleCancel = () => {
    setisModal(false)
    bigplay.stop()
    play.play()
  }
  useEffect(()=>{})
  return (
    <div className={style.video}>
      <Header />
      <div className={style.container}>
        <VideoList showModal={showModal} setplay={setplay}/>
      </div>
      <Modal
        title="A区-1号楼-低压配电房"
        centered
        width={1680}
        footer={null}
        open={isModal}
        onCancel={handleCancel}
      >
        <div style={{display: 'flex'}}>
          <div id="replay" style={{
            width: "1280px",
            height: '717px'
          }}></div>
          <div style={{flex:"1",marginLeft:32}}>
            <div >
                <BlueColumn name="云台控制" styled={{fontSize: 16}}/>
                <div style={controlStyle}></div>
            </div>
            <div style={{marginTop: 32}}>    
              <Collapse 
              defaultActiveKey={['1']} 
              ghost
              expandIconPosition="end">
                <Panel header={<BlueColumn name="视频回放" styled={{fontSize: 16}}/>} key="1">
                  <Form form={form} >
                    <Item style={{width:'100%'}}>
                      <DatePicker 
                      showTime={{
                        defaultValue: moment('00:00:00', 'HH:mm:ss'),
                      }}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="开始时间"
                        className={style.wd100}
                        disabledDate ={disabledDate }
                        onChange={changestartdate}
                       />
                    </Item>
                    <Item>
                      <DatePicker 
                      showTime 
                      placeholder="结束时间" 
                      className={style.wd100} 
                      disabledDate={disabledendDate}></DatePicker>
                    </Item>
                    <Item>
                      <Radio.Group defaultValue="a" buttonStyle="solid"  className={style.wd100}>
                        <Radio.Button value="a" style={tags}>标清</Radio.Button>
                        <Radio.Button value="b"  style={tags}>高清</Radio.Button>
                      </Radio.Group>
                    </Item>
                    <Item>
                      <div style={{display: 'flex',justifyContent: 'space-between'}}>
                      <Button htmlType="button" style={buttonstyle}>
                        返回
                      </Button>
                      <Button  htmlType="button" style={{...buttonstyle,display:'inlineBlock',marginLeft: 'auto',marginRight: 0}}>
                        回放
                      </Button>
                      </div>
                    </Item>
                  </Form>
                </Panel>
              </Collapse>

            </div>
          </div>
        </div>

      </Modal>
    </div>
  )
}
