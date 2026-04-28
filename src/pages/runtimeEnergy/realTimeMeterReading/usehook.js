import {useMemo} from 'react'
import {cols,extendcols} from './data'

export function useCol({energytype }) {
  return useMemo(() => {
     if(!Number.isInteger(energytype)) return []
     let extend = extendcols[energytype]
     console.log("extend",extend)
     return  Array.from(cols).concat(Array.from(extend))
  }, [ energytype]);
}