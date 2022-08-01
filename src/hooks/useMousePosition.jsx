import { useState, useEffect } from "react";
export default function useMousePosition() {
    const [position, setPosition] = useState({x:0, y:0})
    useEffect(() => {
        const move = (e) => {
            setPosition({x: e.x, y: e.y})
        }
        document.addEventListener('mousemove', move)
        return () => {
            document.removeEventListener('mousemove', move)
        }
    }, [])
    return position
}