"use client";

import React, { useState } from 'react';
import { 
  Users, Calendar, FileText, BarChart3, 
  Settings, Search, Bell, CheckCircle, Globe,
  ChevronRight, Download, Plus, Filter, Eye
} from 'lucide-react';

export default function MyanmarSIS() {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* 사이드바 - 한국 교육청 스타일 */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-800 text-white p-0 hidden md:flex flex-col shrink-0 shadow-lg">
        {/* 로고 영역 */}
        <div className="p-6 border-b border-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-700 font-bold text-lg">M</div>
            <div>
              <div className="font-bold text-sm">MCS Academy</div>
              <div className="text-xs text-blue-200">Student Records</div>
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLink 
            icon={<BarChart3 size={18}/>} 
            label="대시보드" 
            active={selectedMenu === 'dashboard'}
            onClick={() => setSelectedMenu('dashboard')}
          />
          <NavLink 
            icon={<Users size={18}/>} 
            label="학생 정보" 
            active={selectedMenu === 'students'}
            onClick={() => setSelectedMenu('students')}
          />
          <NavLink 
            icon={<Calendar size={18}/>} 
            label="출석 관리" 
            active={selectedMenu === 'attendance'}
            onClick={() => setSelectedMenu('attendance')}
          />
          <NavLink 
            icon={<FileText size={18}/>} 
            label="성적 관리" 
            active={selectedMenu === 'grades'}
            onClick={() => setSelectedMenu('grades')}
          />
          <NavLink 
            icon={<Globe size={18}/>} 
            label="인증서 발급" 
            active={selectedMenu === 'certificates'}
            onClick={() => setSelectedMenu('certificates')}
          />
        </nav>

        {/* 하단 메뉴 */}
        <div className="p-4 border-t border-blue-600 space-y-1">
          <NavLink 
            icon={<Settings size={18}/>} 
            label="시스템 설정" 
            active={selectedMenu === 'settings'}
            onClick={() => setSelectedMenu('settings')}
          />
        </div>
      </aside>

      {/* 메인 영역 */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* 상단 헤더 */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">학생 정보 관리 시스템</h1>
              <p className="text-sm text-gray-600 mt-1">Myanmar Christianity School 공식 학적 기록</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <Search size={18} className="text-gray-500"/>
                <input 
                  type="text" 
                  placeholder="검색..." 
                  className="bg-transparent outline-none text-sm w-40"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell size={20} className="text-gray-600"/>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                시스템 정상
              </div>
            </div>
          </div>
        </header>

        {/* 컨텐츠 영역 */}
        <div className="p-6">
          {/* 통계 카드 섹션 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard 
              title="총 학생 수" 
              value="310" 
              subtext="명" 
              change="+4명" 
              icon={<Users size={24}/>}
              color="blue"
            />
            <StatCard 
              title="출석률" 
              value="94" 
              subtext="%" 
              change="안정적" 
              icon={<Calendar size={24}/>}
              color="green"
            />
            <StatCard 
              title="세례 받은 학생" 
              value="215" 
              subtext="명" 
              change="69%" 
              icon={<CheckCircle size={24}/>}
              color="purple"
            />
            <StatCard 
              title="민족 구성" 
              value="12" 
              subtext="개 민족" 
              change="다양성" 
              icon={<Globe size={24}/>}
              color="orange"
            />
          </div>

          {/* 메인 테이블 섹션 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-lg text-gray-900">최근 학생 정보 업데이트</h3>
                <p className="text-sm text-gray-600 mt-1">최근 변경된 학생 정보를 확인하세요</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                  <Filter size={16}/>
                  필터
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  <Plus size={16}/>
                  학생 추가
                </button>
              </div>
            </div>

            {/* 테이블 바디 - 빈 상태 */}
            <div className="p-12 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Search size={32} className="text-gray-400"/>
                </div>
              </div>
              <p className="text-gray-600 font-medium mb-2">데이터를 불러올 수 없습니다</p>
              <p className="text-gray-500 text-sm mb-6">Excel 파일을 가져와서 학생 정보를 입력하세요</p>
              <button className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition">
                <Download size={16}/>
                Excel 가져오기
              </button>
            </div>
          </div>

          {/* 추가 정보 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* 최근 활동 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">최근 활동</h3>
              <div className="space-y-3">
                <ActivityItem 
                  title="학생 정보 수정" 
                  description="김철수 학생의 연락처 변경"
                  time="2시간 전"
                />
                <ActivityItem 
                  title="출석 기록 등록" 
                  description="2024년 4월 5일 출석 현황 입력"
                  time="1일 전"
                />
                <ActivityItem 
                  title="성적 입력" 
                  description="1학기 중간고사 성적 등록"
                  time="3일 전"
                />
              </div>
            </div>

            {/* 빠른 통계 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">학년별 학생 현황</h3>
              <div className="space-y-4">
                <GradeBar label="1학년" count={85} total={310} />
                <GradeBar label="2학년" count={110} total={310} />
                <GradeBar label="3학년" count={115} total={310} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavLink({ icon, label, active = false, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
        active 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-blue-100 hover:bg-blue-600 hover:text-white'
      }`}
    >
      {icon} 
      <span>{label}</span>
      {active && <ChevronRight size={16} className="ml-auto"/>}
    </button>
  );
}

function StatCard({ title, value, subtext, change, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200"
  };

  const iconBg = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
    orange: "bg-orange-100"
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6 transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`${iconBg[color]} p-3 rounded-lg ${colorClasses[color].split(' ')[1]}`}>
          {icon}
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-white rounded border border-gray-200 text-gray-600">
          {change}
        </span>
      </div>
      <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-1">
        <h4 className="text-4xl font-bold text-gray-900">{value}</h4>
        <span className="text-lg text-gray-600 font-medium">{subtext}</span>
      </div>
    </div>
  );
}

function ActivityItem({ title, description, time }) {
  return (
    <div className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <p className="text-gray-600 text-xs mt-0.5">{description}</p>
        <p className="text-gray-500 text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}

function GradeBar({ label, count, total }) {
  const percentage = (count / total) * 100;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{count}명</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
