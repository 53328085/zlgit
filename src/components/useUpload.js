import React, {useState, useRef, useEffect, useCallback} from 'react'
import {ExclamationCircleOutlined} from "@ant-design/icons"
import styled from 'styled-components'
import style from './style.module.less'
import {Image, message, Modal} from 'antd'
/**
 * @author zhenglin zhu
 * @description: //
 * wpx, hpx, 图片限制尺寸。 swpx, shpx 图片显示尺寸。 maxinum 图片限制大小。 getfile 外部组件获取file值的函数, maximum图片大小单位KB。
 * 图片尺寸、格式、大小超出设定值，自动按比例进行压缩， （修改时间：2023-06-12 09:38开始 )
 * @date 2022-11-11 09:38 
 */

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
  title: '',
  accept: "image/*"
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



export default function UseUpload({border, wpx=212, hpx=32, swpx='auto', shpx="auto", maximum=200, getfile=() => {}, value, onChange, isDel}) {

const Preview = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: ${ ({border}) => border ? "1px dashed #999" : "none"};
    overflow: hidden;
  `

const cref = useRef()

 console.log('value', value)
 // img.src = `data:image/png;base64,${src}`
  const [url, setUrl] = useState()

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
  let extref = useRef('')
  let src = null // 图片地址
  let fileData = null // 图片数据
  let clearfile = () => {
    file.current.value = '' // 浏览器的安全机制不允许直接用js修改file的value为空字符串以外的值.否则报错
    extref.current = ''
  }

  const zipImg = (img) => {
    if(!window.createImageBitmap) return message.warning('请使用新版chrome浏览器')
     let {width, height} = img
     let zoom = Math.min(wpx/width, hpx/height);
     zoom = zoom > 1 ? 1 : zoom;
     console.log(zoom)
     let rheight = Math.ceil(height*zoom)
     console.log(rheight)
    createImageBitmap(img, {resizeHeight: rheight, resizeWidth: wpx, resizeQuality: 'high'}).then(res => {

     
      let canvas = document.createElement('canvas')
      canvas.width = wpx;
      canvas.height = rheight;
      let ctx =canvas.getContext('2d')
      ctx.drawImage(res, 0,0)
      let dataUrl =  canvas.toDataURL()
      
      setUrl(dataUrl)
      getfile(dataUrl)
      onChange?.(dataUrl)
      extref.current = ''
    }).catch(e => {
      console.log(e)
    })
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
   /* 1.图片格式， 2.图片尺寸3.图片大小 */
 
  
  let img;
  const upload = (e) => {  // 1.判断图片大小 2. 判断图片格式 3. 判断图片尺寸
    fileData = e.target.files[0];    
    if(!fileData) return message.warning("请选择图片")
    let { name, size } = fileData;
    let limit = Math.ceil(size / 1024);
    let ext = name.split(".")[1];
    console.log(limit)
   // let enable = ext && ["png", "jpg", "jpeg"].includes(ext.toLowerCase()) && limit < maximum;
    if (ext && !["png", "jpg", "jpeg"].includes(ext.toLowerCase())) {   
       // clearfile()   
        extref.current = `图片的格式为${ext},将被转成png格式。`
      // return message.warning("只能选择png/jpg/jpeg格式图片", 1);
    }
    if (ext && limit > maximum) {
        //clearfile() 
        extref.current=extref.current + `图片大小为${limit}kb,将被裁剪为${maximum}kb`
      // return  message.warning(`请选择${maximum}k以内的图片！`, 1);
    }  

  
    if (fileData ) {       
        src = URL.createObjectURL(fileData)
        img = document.createElement('img')  
        let ws = false, hs = false   
     // img.src = `data:image/png;base64,${src}`
         img.src = src
     
         img.onload = ()=> {
            if (img.complete) {
              ws = img.width > wpx
              hs = img.height > hpx

              let wtext = ws ? `宽度大于${wpx}将被按图片比例裁剪` : ''
              let htext = hs ? `高度大于${hpx}将被按图片比例裁剪` : ''
              extref.current= extref.current + wtext + htext;
              console.log(extref.current)
              if(extref.current.trim()) {
                Modal.confirm({
                  title: '图片压缩',
                  icon: <ExclamationCircleOutlined />,
                  content: extref.current,
                  onOk() {
                    zipImg(img)
                  },
                  onCancel() {
                    clearfile() 
                  },
                })
              } else {
                onreader(fileData)
              }
            }
           
        }
      
    
       
      
      //
     
     // onreader(fileData);
      //let reader = new FileReader();
     // console.log(reader.readAsDataURL(fileData))
     // getfile(reader.readAsDataURL(fileData));
      //clearfile() 
     // setUrl(src)
    }
  }
  const delImg = () => {
    if (isDel) return
    setUrl(null) 
    getfile(null)  
    onChange?.('')
    window.URL && URL.revokeObjectURL(src)
  }
  useEffect(() => { 
    setUrl(value); 
  }, [value])



    /*  <Image src={url} preview={true} width={swpx} height={shpx}   />  */
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
