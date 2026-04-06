"use client";

import React from 'react';
import { 
  Users, Calendar, FileText, BarChart3, 
  Settings, Search, Bell, CheckCircle, Globe 
} from 'lucide-react';

export default function MyanmarSIS() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* 사이드바 - MCS 전용 컬러(Deep Blue) */}
      <aside className="w-64 bg-blue-900 text-white p-6 hidden md:flex flex-col shrink-0">
        <div className="text-xl font-bold mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-900 font-black">M</div>
          MCS Academy
        </div>
        <nav className="flex-1 space-y-2">
          <MenuLink icon={<BarChart3 size={18}/>} label="Dashboard" active />
          <MenuLink icon={<Users size={18}/>} label="Student Records" />
          <MenuLink icon={<Calendar size={18}/>} label="Attendance" />
          <MenuLink icon={<FileText size={18}/>} label="Certificates" />
        </nav>
        <div className="mt-auto pt-6 border-t border-blue-800">
          <MenuLink icon={<Settings size={18}/>} label="System Settings" />
        </div>
      </aside>

      {/* 메인 영역 */}
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">MCS Student Management</h1>
            <p className="text-slate-500 text-sm">Official Records System for Myanmar Christianity School</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold">
              <CheckCircle size={14}/> System Online
            </span>
          </div>
        </header>

        {/* 통계 카드 섹션 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Students" value="310" change="+4" color="indigo" icon={<Users size={20}/>} />
          <StatCard title="Attendance" value="94%" change="Stable" color="emerald" icon={<Calendar size={20}/>} />
          <StatCard title="Baptized" value="215" change="69%" color="orange" icon={<FileText size={20}/>} />
          <StatCard title="Ethnicities" value="12" change="Groups" color="blue" icon={<Globe size={20}/>} />
        </div>

        {/* 데이터 테이블 섹션 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="font-bold text-lg">Recent Student Updates</h3>
            <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100">Add Student</button>
          </div>
          <div className="p-12 text-center text-slate-400">
            <div className="mb-4 flex justify-center"><Search size={48} className="opacity-20"/></div>
            <p>Import Excel data to populate the MCS student database.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function MenuLink({ icon, label, active = false }) {
  return (
    <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-blue-800 text-white shadow-inner' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}>
      {icon} <span className="font-medium">{label}</span>
    </button>
  );
}

function StatCard({ title, value, change, icon, color }) {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50"
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
        <span className="text-[10px] font-black uppercase px-2 py-1 bg-slate-100 rounded text-slate-500">{change}</span>
      </div>
      <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">{title}</p>
      <h4 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h4>
    </div>
  );
}
