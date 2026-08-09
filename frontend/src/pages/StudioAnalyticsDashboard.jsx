import React, { useState, useEffect } from 'react';
import './StudioAnalyticsDashboard.css';

function StudioAnalyticsDashboard({ darkMode }) {
  const [customerPrice, setCustomerPrice] = useState(12);
  const [paperCost, setPaperCost] = useState(0.40);
  const [inkCost, setInkCost] = useState(0.20);

  const [metrics, setMetrics] = useState({
    photosPrepared: 48,
    sheetsPrinted: 8,
    grossRevenue: 96.00,
    netProfit: 91.20,
    profitMargin: 95.0,
  });

  useEffect(() => {
    const gross = metrics.sheetsPrinted * customerPrice;
    const totalCost = metrics.sheetsPrinted * (Number(paperCost) + Number(inkCost));
    const profit = gross - totalCost;
    const margin = gross > 0 ? (profit / gross) * 100 : 0;

    setMetrics((prev) => ({
      ...prev,
      grossRevenue: Number(gross.toFixed(2)),
      netProfit: Number(profit.toFixed(2)),
      profitMargin: Number(margin.toFixed(1)),
    }));
  }, [customerPrice, paperCost, inkCost, metrics.sheetsPrinted]);

  return (
    <div className={`studio-dashboard-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="studio-header">
        <h1>📸 Studio Business & Profit Analytics</h1>
        <p>Monitor daily passport photo production, printing overheads, and net studio revenue.</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-icon">🖼️</span>
          <span className="kpi-value">{metrics.photosPrepared}</span>
          <span className="kpi-label">Photos Prepared Today</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">📄</span>
          <span className="kpi-value">{metrics.sheetsPrinted}</span>
          <span className="kpi-label">A4 Sheets Printed</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">💰</span>
          <span className="kpi-value">${metrics.grossRevenue}</span>
          <span className="kpi-label">Gross Revenue</span>
        </div>

        <div className="kpi-card profit-card">
          <span className="kpi-icon">📈</span>
          <span className="kpi-value">${metrics.netProfit}</span>
          <span className="kpi-label">Net Profit ({metrics.profitMargin}%)</span>
        </div>
      </div>

      <div className="controls-panel">
        <h3>⚙️ Live Studio Expense & Pricing Configurator</h3>
        <div className="inputs-grid">
          <div className="input-group">
            <label>Customer Price / Sheet ($)</label>
            <input
              type="number"
              step="0.5"
              value={customerPrice}
              onChange={(e) => setCustomerPrice(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>Paper Cost / Sheet ($)</label>
            <input
              type="number"
              step="0.05"
              value={paperCost}
              onChange={(e) => setPaperCost(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>Ink / Overhead / Sheet ($)</label>
            <input
              type="number"
              step="0.05"
              value={inkCost}
              onChange={(e) => setInkCost(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudioAnalyticsDashboard;
