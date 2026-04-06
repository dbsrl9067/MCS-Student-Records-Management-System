"use client";  // <--- 이 줄이 반드시 맨 위에 있어야 합니다.
import React from 'react';
import { 
  Users, Calendar, FileText, BarChart3, 
  Settings, Search, Bell, CloudOff, CheckCircle 
} from 'lucide-react';

export default function MyanmarSIS() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 1. 사이드바 (Navigation) */}
      <aside className="w-64 bg-indigo-900 text-white p-6 flex flex-col">
        <div className="text-xl font-bold mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-900">H</div>
          HBC Academy
        </div>
        <nav className="flex-1 space-y-4">
          <MenuLink icon={<BarChart3 size={20}/>} label="Dashboard" active />
          <MenuLink icon={<Users size={20}/>} label="Students" />
          <MenuLink icon={<Calendar size={20}/>} label="Attendance" />
          <MenuLink icon={<FileText size={20}/>} label="Certificates" />
        </nav>
        <div className="mt-auto pt-6 border-t border-indigo-800">
          <MenuLink icon={<Settings size={20}/>} label="Settings" />
        </div>
      </aside>

      {/* 2. 메인 콘텐츠 영역 */}
      <main className="flex-1 p-8">
        {/* 헤더 */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Admin</h1>
            <p className="text-slate-500">Student data is synced from Yangon Hub.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle size={14}/> Cloud Synced
            </div>
            <button className="p-2 bg-white border rounded-full hover:bg-slate-100"><Bell size={20}/></button>
          </div>
        </header>

        {/* 대시보드 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Students" value="310" change="+12%" icon={<Users className="text-indigo-600"/>} />
          <StatCard title="Avg. Attendance" value="94%" change="+2%" icon={<Calendar className="text-emerald-600"/>} />
          <StatCard title="Baptized" value="215" change="69%" icon={<FileText className="text-orange-600"/>} />
          <StatCard title="Ethnicity Groups" value="12" change="Stable" icon={<Globe className="text-blue-600"/>} />
        </div>

        {/* 하단 섹션: 리스트와 액션 */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Recent Students</h3>
              <button className="text-indigo-600 text-sm font-medium">View All</button>
            </div>
            {/* 테이블 UI 생략 (실제 데이터 렌더링 영역) */}
            <div className="text-center py-10 text-slate-400">Student list will appear here after Excel import.</div>
          </div>
          
          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Offline Backup</h3>
              <p className="text-indigo-100 text-sm mb-6">Last backup to USB was 2 days ago. Protect your data.</p>
            </div>
            <button className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl shadow-md hover:bg-indigo-50 transition-colors">
              Export to USB (.dat)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// 재사용 가능한 컴포넌트들
function MenuLink({ icon, label, active = false }) {
  return (
    <a href="#" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${active ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}>
      {icon} <span>{label}</span>
    </a>
  );
}

function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{change}</span>
      </div>
      <p className="text-slate-500 text-sm">{title}</p>
      <h4 className="text-2xl font-bold">{value}</h4>
    </div>
  );
}
