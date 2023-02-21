import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Input, Row, Col, Upload, Select, Switch, message } from 'antd';
import style from './style.module.less'
export default function UploadImg({ value, onChange }) {
    const [imageUrl, setImageUrl] = useState('')

    const getBase64 = (img) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result));
            reader.readAsDataURL(img);
        })

    };

    const beforeUpload = async (file) => {
        const isJpg = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpg) {
            message.error('请上传JPG/PNG文件')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            message.error('请上传小于2M的图片')
        }
        const r = await getBase64(file)
        setImageUrl(r)
        onChange(r)
        return false
    }
    // const handleChange=(file)=>{
    //     console.log(file)
    // }
    return (
        <Upload
            name="avatar"
            listType="picture-card"
            className={[style.shape]}
            showUploadList={false}
            beforeUpload={beforeUpload}
            style={{margin:0}}
        // onChange={handleChange}
        >



            <>
                {/* <div style={{ paddingTop: 13 }}></div> */}
                {
                    imageUrl ? <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    /> :
                        <div style={{ background: '#fafafa', height: '100%', lineHeight: '96px', textAlign: 'center', color: '#999', cursor: 'pointer' }}>更新图片</div>
                }
            </>



        </Upload>
    )
}
