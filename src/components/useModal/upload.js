import {Upload, Typography} from 'antd'
import upicon from "@imgs/upload.png"
const {Dragger} = Upload
const {Link, Paragraph} = Typography
export default function Index({accept=".xlsx",link, ...rest}){
   return (
    <Dragger accept={accept}>
       <img src={upicon}></img>
       <Paragraph style={{marginTop: "1em"}}>将文件拖到此处，或<Link>点击上传</Link></Paragraph>
       <Paragraph><Link href={link}>下载模板</Link></Paragraph>
    </Dragger>
   )
}