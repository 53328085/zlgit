import React, {useEffect, useState} from 'react'

export default function usematch() {
let mqString = `(resolution: ${window.devicePixelRatio}dppx)`;

 const [pixe, setPixe] = useState(window.devicePixelRatio)
 useEffect(() => {
    matchMedia(mqString).addEventListener("change", ()=> {
        let pr = window.devicePixelRatio;
        setPixe(pr)
    });
 }, [])
  return pixe
 }
