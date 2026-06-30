import React, { useState, useEffect, useRef, useCallback } from 'react';

const MqttTestComponent = () => {
  // ===== 状态管理 =====
  const [connectStatus, setConnectStatus] = useState('未连接');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [publishTopic, setPublishTopic] = useState('test/topic');
  const [publishPayload, setPublishPayload] = useState('');
  const [subscribeTopic, setSubscribeTopic] = useState('test/topic');
  const [qos, setQos] = useState(0);

  // 连接配置
  const [host, setHost] = useState('ws://broker.emqx.io:8083/mqtt');
  const [clientId, setClientId] = useState('');

  // 使用 ref 保存 client 实例，避免重复渲染
  const clientRef = useRef(null);

  // ===== 生成唯一 Client ID =====
  useEffect(() => {
    const id = `react_mqtt_${Math.random().toString(16).substring(2, 10)}`;
    setClientId(id);
  }, []);

  // ===== 建立连接 =====
  const handleConnect = useCallback(async () => {
    if (clientRef.current?.connected) { // 已有实例返回
      return;
    }
    const client = mqtt.connect(host, {
      clientId,
      clean: true, // true: QoS 0, false: QoS 1 and 2 
      connectTimeout: 4000, // 连接等待时间
      reconnectPeriod: 5000, // 两次重新连接之间的间隔
    });

    client.on('connect', () => {
      setConnectStatus('已连接');
      console.log('MQTT 连接成功');
    });

    client.on('error', (err) => {
      console.error('连接错误:', err);
      setConnectStatus('连接失败');
      client.end();
    });

    client.on('reconnect', () => {
      setConnectStatus('重连中...');
      console.log('正在重连...');
    });

    client.on('offline', () => {
      setConnectStatus('离线');
    });

    // 接收消息
    client.on('message', (topic, message) => {
      const newMessage = {
        id: Date.now(), 
        topic, //  消息的主题
        payload: message.toString(), // 消息的载荷
        timestamp: new Date().toLocaleTimeString(),
      };
      // 此处省略了对newMessage 的处理
    });

    clientRef.current = client;
  }, [host, clientId]);

  // ===== 断开连接 =====
  const handleDisconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.end(false, () => {
        setConnectStatus('未连接');
        setIsSubscribed(false);
        console.log('已断开连接');
      });
      clientRef.current = null;
    }
  }, []);

  // ===== 订阅主题 =====
  const handleSubscribe = useCallback(() => {
    if (clientRef.current?.connected && subscribeTopic) {
      clientRef.current.subscribe(subscribeTopic, { qos }, (error) => {
        if (error) {
          
        } else {
           
        }
      });
    }
  }, [subscribeTopic, qos]);

  // ===== 取消订阅 =====
  const handleUnsubscribe = useCallback(() => {
    if (clientRef.current?.connected && subscribeTopic) {
      clientRef.current.unsubscribe(subscribeTopic, { qos }, (error) => {
        if (error) {
           
        } else {
          
          
        }
      });
    }
  }, [subscribeTopic, qos]);

  // ===== 发布消息 =====
  const handlePublish = useCallback(() => {
    if (clientRef.current?.connected && publishTopic && publishPayload) {
      clientRef.current.publish(publishTopic, publishPayload, { qos }, (error) => {
        if (error) {
          
        } else {
          
        }
      });
    }
  }, [publishTopic, publishPayload, qos]);

  // ===== 清空消息列表 =====
  const handleClearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // ===== 组件卸载时断开连接 =====
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, []);

  // ===== 渲染 =====
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🔌 MQTT 测试工具（React）</h1>

      {/* 连接配置区域 */}
      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h3>连接配置</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <label>
            Broker 地址：
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              style={{ width: 320, padding: 6 }}
              placeholder="ws://broker.emqx.io:8083/mqtt"
            />
          </label>
          <label>
            QoS：
            <select value={qos} onChange={(e) => setQos(Number(e.target.value))} style={{ padding: 6 }}>
              <option value={0}>0 - 最多一次</option>
              <option value={1}>1 - 至少一次</option>
              <option value={2}>2 - 恰好一次</option>
            </select>
          </label>
          <span>
            状态：
            <strong style={{ color: connectStatus === '已连接' ? 'green' : 'red' }}>
              {connectStatus}
            </strong>
          </span>
          <button onClick={handleConnect} disabled={connectStatus === '已连接'} style={btnStyle}>
            连接
          </button>
          <button onClick={handleDisconnect} disabled={connectStatus === '未连接'} style={btnStyle}>
            断开
          </button>
        </div>
        <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
          Client ID: {clientId}
        </p>
      </div>

      {/* 订阅区域 */}
      <div style={{ background: '#f0f8ff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h3>订阅管理</h3>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <label>
            主题：
            <input
              type="text"
              value={subscribeTopic}
              onChange={(e) => setSubscribeTopic(e.target.value)}
              style={{ width: 250, padding: 6 }}
              placeholder="test/topic"
            />
          </label>
          <button onClick={handleSubscribe} disabled={!isSubscribed === false} style={btnStyle}>
            订阅
          </button>
          <button onClick={handleUnsubscribe} disabled={!isSubscribed} style={btnStyle}>
            取消订阅
          </button>
          {isSubscribed && (
            <span style={{ color: 'green', fontWeight: 'bold' }}>
              ✓ 已订阅: {subscribeTopic}
            </span>
          )}
        </div>
      </div>

      {/* 发布区域 */}
      <div style={{ background: '#fff8f0', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h3>发布消息</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <label>
            主题：
            <input
              type="text"
              value={publishTopic}
              onChange={(e) => setPublishTopic(e.target.value)}
              style={{ width: 200, padding: 6 }}
              placeholder="test/topic"
            />
          </label>
          <label>
            消息内容：
            <input
              type="text"
              value={publishPayload}
              onChange={(e) => setPublishPayload(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePublish()}
              style={{ width: 250, padding: 6 }}
              placeholder='例如: {"temperature": 25}'
            />
          </label>
          <button onClick={handlePublish} style={btnStyle}>
            发布
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>收到的消息（{messages.length} 条）</h3>
          <button onClick={handleClearMessages} style={btnStyle}>
            清空
          </button>
        </div>
        {messages.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: 20 }}>
            暂无消息，请订阅主题后等待消息...
          </p>
        ) : (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>[{msg.topic}]</span>{' '}
                  <span>{msg.payload}</span>
                </div>
                <span style={{ color: '#999', fontSize: 12, whiteSpace: 'nowrap' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 按钮样式
const btnStyle = {
  padding: '6px 16px',
  cursor: 'pointer',
  border: '1px solid #d9d9d9',
  borderRadius: 4,
  background: '#fff',
};

export default MqttTestComponent;