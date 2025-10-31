import {Slider} from 'antd'
import styled from 'styled-components'
export const CSlider = styled(Slider)`
&&{
  .ant-slider-mark {
    .ant-slider-mark-text{
     font-size: 12px;
}
  }
  
    .ant-slider-handle:focus,.ant-slider-track{
        background-color: #1E50E6;
    }
     .ant-slider-rail{
      background-color: rgba(0,0,0,0.04);
     }
    .ant-slider-handle {
      height: 14px;
      width: 14px;
    }
}
`