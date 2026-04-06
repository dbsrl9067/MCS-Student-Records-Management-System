import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Database, Globe, Download } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { year: '2024', count: 250 },
    { year: '2025', count: 285 },
    { year: '2026', count: 310 }
  ];

  return (
    <div style={{ padding: '40px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>HBC School Management System</h1>
        <p style={{ color: '#6b7280' }}>Myanmar Region Admin Center</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Users color="#3b82f6" />
          <p style={{ fontSize: '14px', marginTop: '8px' }}>Total Students</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>310</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Globe color="#10b981" />
          <p style={{ fontSize: '14px', marginTop: '8px' }}>Active Schools</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>12</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Database color="#f59e0b" />
          <p style={{ fontSize: '14px', marginTop: '8px' }}>Last Sync</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>2026-04-06</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', height: '300px' }}>
        <h3 style={{ marginBottom: '16px', fontWeight: '600' }}>Annual Student Growth</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={stats}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#000', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
        <Download size={18} /> Import USB Data (.dat)
      </button>
    </div>
  );
}