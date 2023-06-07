import { useState, useRef, useEffect } from 'react';
import ModalDialog from './ModalDialog.js';
import  CryptoJS from 'crypto-js'
export default function App() {
  const [show, setShow] = useState(false);
  const ref = useRef()
  const test = (data, key, iv) => {
     data = CryptoJS.enc.Utf8.parse(JSON.stringify(data))
     key = CryptoJS.enc.Utf8.parse(key)
     iv = CryptoJS.enc.Utf8.parse(iv)
     // Encrypt
     var ciphertext = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.NoPadding
  });
  console.log(ciphertext.toString(), ciphertext.ciphertext.toString());
  // Decrypt
  var bytes = CryptoJS.AES.decrypt(ciphertext, key, {
      iv: iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.NoPadding
  });
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  console.log(originalText);
  }
  useEffect(() => {
    let key = 'bzKvXm8iDXuPT15n', iv = '8392839dje837uji', data =  "zhuzl"
            test(data, key, iv);

 /* let ciphertext =   CryptoJS.AES.encrypt('123', 'pass', {
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.AnsiX923,
      format: CryptoJSAESFormat
    }).toString();
    console.log(ciphertext) */
    
  }, [])

  return (
    <div>
      <dialog ref={ref}>
        <h1>欢迎光临</h1>
        <button onClick={() => ref.current.close()}>close</button>
      </dialog>
      <button onClick={() => ref.current.showModal()}>open</button>
     
      <button onClick={() => setShow(true)}>
        Open dialog
      </button>
      <ModalDialog isOpen={show}>
        Hello there!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Close</button>
      </ModalDialog>
    </div>
  );
}