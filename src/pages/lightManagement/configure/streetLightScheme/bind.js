import React, {useRef} from 'react'
import CModal from '@com/useModal'
import UserTable from "@com/useTable";

export default function Index({}) {
  const bindRef = useRef()
  const onOk =()=> {

  }
  return (
    <div>
          <CModal title="路灯绑定"   onOk={onOk}   width={1380} mold="cust"    ref={bindRef}>
                
           </CModal>   
    </div>
  )
}
