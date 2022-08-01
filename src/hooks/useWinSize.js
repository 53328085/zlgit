import React, {useState, useEffect, useCallback} from 'react'

export  function useWinSize() {
    let w = document.documentElement.clientWidth;
    let h = document.documentElement.clientHeight;
    const [size, setSize] = useState({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    })
    const resize = useCallback(() => {
        setSize({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight})
       
    }, [])
    useEffect(() => {
        window.addEventListener('resize', () => {
            console.log('@')
            resize()
        }) 
        return window.removeEventListener('resize', resize)
    }, [])
    return size
}
