import React from 'react'

export default function Index({lightdata}) {
  return (
    <div className="leftup">
      <div className='item'>
        <span>太阳能路灯数</span>
         <span className="num"> {lightdata?.solarNum }</span>
        </div>
        <div className="item">
            <span>路灯状态</span>
            <div className="state">
                <div className='statevalue'>
                    <span className='dot on'></span>
                    开：
                     <span className='num'>{lightdata?.lightUpNum  }</span>
                </div>
                <div className="statevalue">
                    <span className='dot off'>
                       
                    </span>
                    关：
                    <span className="num">
                    {lightdata?.lightDownNum   }
                    </span>
                </div>
            </div> 
        </div>
        <div className="item">
            <span>剩余安时</span>
            <span className='num'>{lightdata?.remainAmpHour }</span>
        </div>
    </div>
  )
}

