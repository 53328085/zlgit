import React, {useState, useRef, useEffect} from 'react'
import {PlusOutlined} from "@ant-design/icons"
import styled from 'styled-components'
import {Image, message} from 'antd'
/**
 * @author zhenglin zhu
 * @description: //wpx, hpx, 图片限制尺寸。 swpx, shpx 图片显示尺寸。 maxinum 图片限制大小。 getfile 外部组件获取file值的函数, maximum图片大小单位KB
 * @date 2022-11-11 09:38
 */
export default function UseUpload({border, wpx=212, hpx=32, swpx='auto', shpx="auto", maximum=200, getfile=() => {}, value, onChange}) {
const Preview = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: ${ ({border}) => border ? "1px dashed #999" : "none"};
    overflow: hidden;
  `

const Imgbox = styled.div`
  && {
    position: relative;    
    overflow: hidden;
  }
`
const Ciocn = styled.div`
  && {
    font-size: 24px;
    position: relative;
    height:40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
 
`
const Uspan = styled.span`
  && {
    display: inline-block;
    height: 40px;
    width: 40px;
    position: relative;
    font-size: 40px;
    line-height: 40px;
    overflow: hidden;
    color: #333;
  }
 &&:hover {
    cursor: pointer;
   // color: #999
   }
   
` 
const Luspan = styled(Uspan)`
  && {
    position: absolute;
     top: 0px;
     right: 0px;
     font-size: 32px;
     line-height: 32px

  }
`
const Ifile = styled.input.attrs(props => ({
  type: "file",
  title: ''
}))`
  height: 40px;
  width: 40px;
  opacity: 0;
  position: absolute;
  top: 0;
  &&:hover {
    cursor: pointer;
  }
`

 // img.src = `data:image/png;base64,${src}`
  const [url, setUrl] = useState(value)
  const file = useRef()
  const imgsize = (src) => {
    const msg = () => {
        if (img.width <= wpx) return message.warning(`图片宽度大于${wpx}像素`)
        if (img.height <= hpx) return message.warning(`图片高度大于${hpx}像素`)
    }
    let img = document.createElement('img')  
    img.src = src
     if(img.complete) {
        msg()
     } else {
       img.onload = ()=> {
           msg()
       }
     }
   
  }
  let src = null // 图片地址
  let fileData = null // 图片数据
  const clearfile = () => {
    file.current.value = '' // 浏览器的安全机制不允许直接用js修改file的value为空字符串以外的值.否则报错
  }
  const onreader = (file) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        src = reader.result
        clearfile() 
        setUrl(src)
        getfile(src); 
        onChange?.(src)
    }
    reader.onerror = () => {
        return message.warning(reader.error || '图片加载出错' )
    }
   };
 
  const upload = (e) => {  // 1.判断图片大小 2. 判断图片格式 3. 判断图片尺寸
    fileData = e.target.files[0];    
    let { name, size } = fileData;
    let limit = Math.ceil(size / 1024);
    let ext = name.split(".")[1];
    let enable = ext && ["png", "jpg", "jpeg"].includes(ext.toLowerCase()) && limit < maximum;
    if (ext && !["png", "jpg", "jpeg"].includes(ext.toLowerCase())) {   
        clearfile()   
      return message.warning("只能选择png/jpg/jpeg格式图片", 1);
    }
    if (ext && limit > maximum) {
        clearfile() 
       return  message.warning(`请选择${maximum}k以内的图片！`, 1);
    }  
    if (fileData && enable) { 
        src = URL.createObjectURL(fileData)
        let img = document.createElement('img')  
        let ws = false, hs = false   
     // img.src = `data:image/png;base64,${src}`
         img.src = src
      if(img.complete) {
          ws = img.width <= wpx
          hs = img.height <= hpx
      } else {
        img.onload = ()=> {
            ws = img.width <= wpx
            hs = img.height <= hpx
        }
      }
      if (ws || hs) {
        let text = ws ? '宽' : hs ? '高' : ''
        let size = ws || hs
        clearfile() 
        return message.warning(`图片${text}度大于${size}像素`);
      }
      //

      onreader(fileData);
      //let reader = new FileReader();
     // console.log(reader.readAsDataURL(fileData))
     // getfile(reader.readAsDataURL(fileData));
      //clearfile() 
     // setUrl(src)
    }
  }
  const delImg = () => {
    setUrl(null) 
    getfile(null)  
    onChange?.('')
    window.URL && URL.revokeObjectURL(src)
  }
 
  return (
     <Preview>
      {
        url ? 
        (<Imgbox>
            <Image src={url} preview={true} width={swpx} height={shpx}   /> 
            <Luspan onClick={delImg} className="iconfont iconicon_shanchu"></Luspan>
        </Imgbox>)
        : 
        <>
        <Ciocn>   
          <Uspan className='iconfont'>
          &#xe62d;
            <Ifile onChange={upload} ref={file} />
          </Uspan>    
      
        </Ciocn>
        </>

      } 
     </Preview>
  )
}
