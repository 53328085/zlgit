import React from "react";
import styled from "styled-components";
import batteryPack from './imgs/batteryPack.png'
import clusterNormal from './imgs/clusterNormal.png'
import clusterHover from './imgs/clusterHover.png'
export default function index (props) {
    let {data} = props
    const BgStyle = styled.div`
        width: 160px;
        height: 505px;
        margin-top: -1px;
        background-image: url(${clusterNormal});
        background-size: 100% 100%;
        margin-right: 107px;
        position:relative;
        cursor: pointer;
        &:hover{
            background-image: url(${clusterHover});
        }
    `
    const battery ={
        position:'absolute',
        display:'inline-block',
        height:340,
        width: 160,
        lineHeight:'20px',
        left: 0,
        bottom: 0,
        padding:16,
        // backgroundColor: '#000',
        // border: '1px solid rgb(35, 122, 228)',
        borderRadius: 2,
        color:'#fff',
        fontSize: 12,
        cursor:'pointer',
    }
    const NormalValue = props => {
        return (
            <div style={{width: 127, border:'1px solid #d7d7d7', borderRadius: 2, marginBottom: 12}}>
                <div style={{width: '100%', height: 24, lineHeight:'24px', backgroundColor:'#237ae4',borderBottom:'1px solid #d7d7d7'}}>
                    <span style={{display:"inline-block", width: 62, textAlign:'center'}}>{props.title[0]}</span>
                    <span style={{display:"inline-block", width: 62, textAlign:'center'}}>{props.title[1]}</span>
                </div>
                <div style={{width: '100%', height: 24, lineHeight:'24px'}}>
                    <span style={{display:"inline-block", width: 62, textAlign:'center'}}>{props.value[0]}</span>
                    <span style={{display:"inline-block", width: 62, textAlign:'center'}}>{props.value[1]}</span>
                </div>
            </div>
        )
    }
    const Progress = props => {
        return (
            <div style={{ position:'relative',marginBottom: 10, width: 128, height: 24, background:'#2b2b2b', border:"1px solid rgb(153, 153, 153)", borderRadius: 2, display:'flex', alignItems:'center',justifyContent:'center'}}>
                <div style={{ position:'absolute',zIndex:0, left:-1, top: -1, width: props.value, height: 24, background: props.color, border:"1px solid rgb(228, 228, 228)", borderRadius: 2,borderRight:'none'}}></div>
                <span style={{zIndex: 1}}>{ props.title + ' ' + props.value }</span>
            </div>
        )
    }
    const toBatteryData = () => {
        props.toBattery()
    }
    return (
        <BgStyle>
            <div style={battery} onClick={()=>toBatteryData()}>
                <div style={{fontSize: 14, lineHeight: '14px', marginBottom: 12,color:'#a1a1a1', textAlign:'center', wordWrap:'break-word', }}>{data.batteryClusterName}</div>
                <div style={{width: 127, border:'1px solid #d7d7d7', borderRadius: 2, marginBottom: 12}}>
                    <div style={{width: '100%', height: 24, lineHeight:'24px', backgroundColor:'#237ae4',borderBottom:'1px solid #d7d7d7', textAlign:'center'}}>
                        <span style={{display:"inline-block", width: 62}}>充放电状态</span>
                    </div>
                    <div style={{width: '100%', height: 24, lineHeight:'24px', textAlign:'center'}}>
                        <span style={{display:"inline-block", width: 62, }}>{data.chargeState}</span>
                    </div>
                </div>
                <Progress title={'SOC'} value={data.soc +'%'} color={'#060'}></Progress>
                <Progress title={'SOH'} value={data.soh + '%'} color={'#06f'}></Progress>
                <div style={{ height: 0, border:'1px dashed #666', margin:'16px 0'}}></div>
                <NormalValue title={['电压高值', '电压低值']} value={[data.maxV + '(V)', data.minV + '(V)']}></NormalValue>
                <NormalValue title={['温度高值', '温度低值']} value={[data.maxTemp + '(℃)', data.minTemp + '(℃)']}></NormalValue>
            </div>
        </BgStyle>
    )
}