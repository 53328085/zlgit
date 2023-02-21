import React from 'react'
import {message} from 'antd'
export const custMsg = ({success=true, type='success', content='', duration=0.3, onClose= () => {}} = {}) => {
    if (!['success','error', 'warning'].includes(type)) return ;
    success && message[type]({
        content,
        duration,
        onClose,
       })
}
