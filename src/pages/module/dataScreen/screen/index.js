const path = require('path')
const  screenes ={
    "bigScreenUrl":0,
  
    "monitorBigScreenUrl": 0,
   
    "safeBigScreenUrl": 0,
   
    "distributionScreenUrl": 0,
   
    "prepayScreenUrl": 0,
    
    "energyScreenUrl": 0,
   
    "solarScreenUrl": 0,
    
    "storageScreenUrl": 0,
    
    "carbonScreenUrl": 0,
    
    "maintenanceScreenUrl":0
}

let files = require.context('./', true, /\.jsx$/)
let fileNames = []
files.keys().forEach(filep => {   
    fileNames.push(path.basename(filep, '.jsx'))
});
Object.keys(screenes).forEach(name => {
    
   let num = fileNames.filter(n => n.includes(name))?.length ?? 0;
   screenes[name] = num

})
  
 export default screenes

/*   
  "bigScreenUrl":0,
  
  "monitorBigScreenUrl": 0,
 
  "safeBigScreenUrl": 0,
 
  "distributionScreenUrl": 0,
 
  "prepayScreenUrl": 0,
  
  "energyScreenUrl": 0,
 
  "solarScreenUrl": 0,
  
  "storageScreenUrl": 0,
  
  "carbonScreenUrl": 0,
  
  "maintenanceScreenUrl":0 */