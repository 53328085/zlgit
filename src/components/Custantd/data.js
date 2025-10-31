 let marks = {};
 [0,10,20,30,40,50,60,70,80,90,100].forEach(v=>{
   marks[v] =  {
    style:{
      color: '#000',
      fontSize: 12,
     },
     label: <strong>{v}</strong>
   }

}) 
export {marks}