import React, { useEffect, useState, useRef ,forwardRef,useImperativeHandle} from 'react'
import { Upload } from 'antd';
import style from './style.module.less'
function UploadImg(props) {
  // const [fileList, setFileList] = useState() //文件列表
  // const [imageUrl, setImageUrl] = useState(''); //上传的图片
  const upload = useRef()
  const beforeUpload = (file) => {
    console.log(file)
    props.setFileList([...fileList, file])
    return false
  }
  //获取图片base64结果
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
      callback(reader.result)
    }
  }

  const handleChange = (info) => {
    getBase64(info.file, (url) => {
      props.setImageUrl(url);
    })

  }
  // useImperativeHandle(ref,()=>({
  //   imageUrl,
  //   setImageUrl
  // }))
  return (
    
      <Upload
        name="avatar"
        listType="picture-card"
        className={style.uploader}
        showUploadList={false}
        fileList={props.fileList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        ref={upload}
      >
        {
          props.imageUrl ?
            <img
              src={props.imageUrl}
              alt="avatar"
              style={{
                width: '100%',
                height: '100%',
              }}
            /> : <div style={{ background: '#fafafa', height: '100%', lineHeight: '90px', textAlign: 'center', color: '#999', cursor: 'pointer' }}>更新图片</div>
        }

      </Upload>
    

  )
}export default UploadImg

// export default forwardRef(UploadImg)



