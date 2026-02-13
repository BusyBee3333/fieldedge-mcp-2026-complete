import { useState, useEffect } from 'react';
import './styles.css';

export default function pricebookApp() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: '1', name: 'Sample Item 1', status: 'active' },
        { id: '2', name: 'Sample Item 2', status: 'active' },
        { id: '3', name: 'Sample Item 3', status: 'pending' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading price book...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Price Book</h1>
        <button className="btn-primary">+ Add New</button>
      </header>

      <div className="content">
        <div className="section">
          <h2>Manage pricing for services</h2>
          <div className="data-grid">
            {data.map((item) => (
              <div key={item.id} className="data-card">
                <h3>{item.name}</h3>
                <span className={`badge badge-${item.status}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
