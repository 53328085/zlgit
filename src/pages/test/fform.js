import React, { useRef } from 'react';
import { useReactToPrint, generateAndSavePDF } from 'react-to-print';
 
export  default function Index(){
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    content: () => contentToPrint.current,
    copyStyles: false,
    
  });

  return (
    <>
      <div ref={contentToPrint} className='zl'>The default page size is usually A4. Most browsers do not allow JavaScript or CSS to set the page size. For the browsers that do, it is usually done using the CSS page size property. Check caniuse to see if the browsers you develop against support this</div>
      <button onClick={() => {
        handlePrint();
      }}>
        PRINT
      </button>
    </>
  )
}