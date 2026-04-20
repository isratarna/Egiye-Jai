import React from 'react';

const AdminHeader = ({ title, count, subtitle }) => {
  return (
    <div className="admin-header">
      <div className="header-content">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      {count !== undefined && (
        <div className="header-count">
          <span className="count-number">{count}</span>
          <span className="count-label">Total</span>
        </div>
      )}
    </div>
  );
};

const AdminCard = ({ title, value, icon, color }) => {
  return (
    <div className={`admin-card admin-card-${color}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-value">{value}</div>
      </div>
    </div>
  );
};

const AdminTable = ({ headers, data, onRowAction }) => {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx}>{header}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {headers.map((header, colIdx) => (
              <td key={colIdx}>{row[header.toLowerCase()]}</td>
            ))}
            <td>
              <button onClick={() => onRowAction(row.id)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { AdminHeader, AdminCard, AdminTable };
