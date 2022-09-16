import React, { useState, useEffect } from 'react'
import { Form, Select, Modal,Collapse,DatePicker,Radio,Button   } from 'antd'
import Header from './header'
import VideoList from './videolist'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import cameraBG from '@imgs/carmeraBG.png'
import EZUIKit from "ezuikit-js";

export default function Index() {
  const { Panel } = Collapse;
  const {Item} =Form
  const [form] = Form.useForm();
  const [isModal, setisModal] = useState(false)
  const [play,setplay] =useState('')
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
  const showModal = () => {
    setisModal(true)
    play.stop()
    let player
    setTimeout(()=>{
      player= new EZUIKit.EZUIKitPlayer({
        id: 'replay',
        accessToken: 'at.2hyc53ltbwytyh1i8r669k4zdbua2t43-7efxli8xb0-0g9ij9v-iewfmsfph',
        url: "ezopen://open.ys7.com/G88471891/1.hd.live",
        width: 1280, 
        height: 717,
        footer: ["hd"],
      })
      setplay(player);
    },0)
   
    
    
  }
  const handleCancel = () => {
    setisModal(false)
    play.stop()
  }
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
                      <DatePicker showTime placeholder="开始时间" className={style.wd100}></DatePicker>
                    </Item>
                    <Item>
                      <DatePicker showTime placeholder="结束时间" className={style.wd100}></DatePicker>
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
