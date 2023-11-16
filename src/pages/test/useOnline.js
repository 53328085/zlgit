import React, {useEffect, useState, useSyncExternalStore} from 'react'


export default function useOnline() {
    function subscribe(callback) {
        window.addEventListener('online', callback)
        window.addEventListener('offline', callback);
        return () => {
         window.removeEventListener('online', callback);
         window.removeEventListener('offline', callback)
        }
     }
   return useSyncExternalStore(
    subscribe,
    () => ({online: navigator.onLine}),
    () => true //初始快照
   )
}
