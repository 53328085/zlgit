import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import {Space, Image, Modal, Button} from 'antd'
import {UserOutlined, PoweroffOutlined} from '@ant-design/icons'
import Chintlog from '@imgs/chintlog.png'
export default function Index() {
  const Mainbox = styled.div`  
    background-image: linear-gradient(#003399, #000000);
    padding: 32px;
    flex: 1;
    display: grid;
    grid-template-rows: 101px 1fr;
    color: #fff;
    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 32px;
        border-bottom: 1px solid #dedede;
        .name {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .ch {
                color: #fff;
                font-size: 36px;
                height: 46px;
                line-height: 46px;
            }
            .en {
                color: rgba(255,255, 255, 0.6);
                font-size: 16px;
                font-style: italic;
            }
           
        }
        .loginName {
                font-size: 20px;
                color: #f2f2f2;
            }
        .exit {
            color: rgba(255,255,255, 0.6);
            transition: color 0.3s;
            &:hover {
                color: #fff;
            }
        }
    }
  `
  const navigate = useNavigate()
 const [isshow, setShow] = useState(false) 
 const onShow = () => {
    console.log(1111)
    setShow(true)
 }
 const onCancel = () => {
    setShow(false)
 }
 const onOk = () => {
    setShow(false)
    navigate('/', {})

 }
 const {chineseTitle, englishTitle, systemLogoImage} = useSelector(state => state.system)
 const {loginName} = useSelector(state => state.user)
  return (
    <>
    <Mainbox>
       <div className='title'>
          <Space size={32}>
              <Image src={systemLogoImage ?  "data:image/png;base64,"+ systemLogoImage : Chintlog} height={68} preview={false}></Image>
              <div className='name'>
                 <p className='ch'>{chineseTitle || '正泰智慧能源服务平台'}</p>
                 <p className='en'>{englishTitle || 'Chint Smart Energy Service Platform'}</p>
              </div>
          </Space>
          <Space size={32}>
                <UserOutlined style={{color:'#fff', fontSize: '32px'}}/> 
                <span className='loginName'>{loginName}</span>
                <PoweroffOutlined style={{fontSize: '30px', cursor: "pointer"}} className="exit" onClick={() => onShow()} />
          </Space>
       </div>
     

    </Mainbox>
    <Modal title="提示信息" open={isshow} onOk={onOk} onCancel={onCancel} centered={true}>
        <p>是否退出系统？</p>
        
      </Modal>
    </>
  )
}
