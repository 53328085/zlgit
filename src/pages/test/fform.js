import React, { useState, useEffect, useCallback, useEffectEvent} from 'react';

 
  function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}


const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const [message, setMessage] = useState('');
  const onConnected = useEffectEvent(() => {
    console.log('Connected!', theme);
  })
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect()
    return () => connection.disconnect();
  }, [roomId, theme]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  const [theme, setTheme] = useState(false)
  const Theme = theme ? "dark" : "linght"
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
      use dark theme
        <input type="checkbox" checked={theme} onChange={e => {
          console.log(e);
          setTheme(e.target.checked)
          }} />
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} theme={Theme} />}
    </>
  );
}
