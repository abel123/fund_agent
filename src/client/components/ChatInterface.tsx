import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../shared/types';
import './ChatInterface.css';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          userId: 'user1',
        }),
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，处理您的请求时出现了错误，请稍后重试。',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { text: '📊 我的持仓情况', message: '我的持仓情况' },
    { text: '💰 今天赚了多少', message: '今天赚了多少' },
    { text: '📈 本周收益', message: '这周收益怎么样' },
    { text: '📉 本月收益', message: '本月收益怎么样' },
    { text: '📋 生成日报', message: '生成日报' },
    { text: '❓ 赎回费怎么算', message: '赎回费怎么算' },
  ];


  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">💬</div>
            <h2>欢迎使用基金持仓对话式日报</h2>
            <p className="welcome-subtitle">智能查询、收益分析、涨跌归因</p>
            <div className="quick-actions">
              <p className="quick-actions-title">快速开始：</p>
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="quick-action-card"
                    onClick={() => sendMessage(action.message)}
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                {msg.charts && msg.charts.length > 0 && (
                  <div className="message-charts">
                    {/* 图表组件可以在这里添加 */}
                  </div>
                )}
              </div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="loading-indicator">
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <div className="input-wrapper">
          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题，或点击上方快速开始..."
            rows={1}
          />
          <button
            className="send-button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            title="发送 (Enter)"
          >
            <span className="send-icon">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}


