import ChatInterface from './components/ChatInterface';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>💰 基金持仓对话式日报</h1>
          <p>智能查询、收益分析、涨跌归因</p>
        </header>
        <ChatInterface />
      </div>
    </div>
  );
}

export default App;

