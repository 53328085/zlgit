import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();
  
  useEffect(() => {
    if (!isOpen) { //
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
    //  console.log(1111111111)
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
