import { useState } from 'react';
import style from './ChatBot.module.css'
export default function ChatBot() {
  const [messages, setMessages] = useState([{ role: 'system', content: 'You are a helpful shopping assistant.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || 'No response';
    setMessages([...newMessages, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  return (
   <div className={style.chatbotContainer}>
  <div className={style.chatbotContent}>
    {messages.filter(m => m.role !== 'system').map((msg, i) => (
      <div 
        key={i} 
        className={`${style.message} ${msg.role === 'assistant' ? style.assistant : style.user}`}
      >
        <p>{msg.content}</p>
      </div>
    ))}
    {loading && <p className={style.typing}>typing...</p>}
  </div>

  <div className={style.inputContainer}>
    <input
      value={input}
      onChange={e => setInput(e.target.value)}
      placeholder="Type your message..."
    />
    <button onClick={sendMessage}>Send</button>
  </div>
</div>

  );
}
