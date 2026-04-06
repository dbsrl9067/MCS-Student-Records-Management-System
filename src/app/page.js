"use client";

import React, { useState } from 'react';
import { 
  Users, Calendar, FileText, BarChart3, 
  Settings, Search, Bell, CheckCircle, Globe,
  ChevronRight, Download, Plus, Filter, Eye,
  Menu, X
} from 'lucide-react';

export default function MyanmarSIS() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 상단 네비게이션 - CBNU 스타일 */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        {/* 상단 바 */}
        <div className="bg-gray-900 text-white text-xs py-2 px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">Login</a>
            <a href="#" className="hover:text-gray-300">Sitemap</a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">English</a>
            <a href="#" className="hover:text-gray-300">Contact</a>
          </div>
        </div>

        {/* 로고 및 메인 네비게이션 */}
        <div className="px-4 md:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                M
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900">MCS Academy</div>
                <div className="text-xs text-gray-600">Student Information System</div>
              </div>
            </div>

            {/* 모바일 메뉴 토글 */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* 우측 아이콘 */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <Search size={18} className="text-gray-500"/>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent outline-none text-sm w-40"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell size={20} className="text-gray-600"/>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                System Online
              </div>
            </div>
          </div>

          {/* 메인 네비게이션 메뉴 */}
          <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-1 md:gap-0 border-t md:border-t-0 pt-4 md:pt-0 md:border-t-2 md:border-blue-600`}>
            <NavMenuItem label="Overview" icon={<BarChart3 size={16}/>} />
            <NavMenuItem label="Student Records" icon={<Users size={16}/>} />
            <NavMenuItem label="Attendance" icon={<Calendar size={16}/>} />
            <NavMenuItem label="Grades" icon={<FileText size={16}/>} />
            <NavMenuItem label="Certificates" icon={<Globe size={16}/>} />
            <NavMenuItem label="Settings" icon={<Settings size={16}/>} />
          </nav>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Student Information System</h1>
          <p className="text-blue-100 text-lg">Myanmar Christianity School - Official Student Records Management</p>
        </div>
      </section>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
        {/* 통계 카드 섹션 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Students" 
            value="310" 
            icon={<Users size={28}/>}
            color="blue"
            trend="+4 this month"
          />
          <StatCard 
            title="Attendance Rate" 
            value="94%" 
            icon={<Calendar size={28}/>}
            color="green"
            trend="Stable"
          />
          <StatCard 
            title="Baptized Students" 
            value="215" 
            icon={<CheckCircle size={28}/>}
            color="purple"
            trend="69% of total"
          />
          <StatCard 
            title="Ethnic Groups" 
            value="12" 
            icon={<Globe size={28}/>}
            color="orange"
            trend="Diversity"
          />
        </div>

        {/* 퀵 메뉴 섹션 - CBNU 스타일 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickMenuCard 
            title="Student Services"
            items={[
              "Letter of Recommendation",
              "Student ID Reissuance",
              "International Student ID",
              "Leave of Absence",
              "Withdrawal Processing",
              "Academic Counseling"
            ]}
            color="blue"
          />
          <QuickMenuCard 
            title="Common Services"
            items={[
              "Online Application",
              "International Shipping",
              "Certificate Application",
              "Mobile Services",
              "Certificate Issuance",
              "Transcript Request"
            ]}
            color="green"
          />
          <QuickMenuCard 
            title="Staff Services"
            items={[
              "Staff ID Issuance",
              "Certificate Issuance",
              "Curriculum Management",
              "Academic Affairs",
              "System Management",
              "Report Generation"
            ]}
            color="purple"
          />
        </div>

        {/* 메인 테이블 섹션 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-8">
          {/* 테이블 헤더 */}
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50">
            <div>
              <h3 className="font-bold text-lg text-gray-900">Recent Student Updates</h3>
              <p className="text-sm text-gray-600 mt-1">Latest changes to student information</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex-1 md:flex-none justify-center">
                <Filter size={16}/>
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex-1 md:flex-none justify-center">
                <Plus size={16}/>
                Add Student
              </button>
            </div>
          </div>

          {/* 테이블 바디 - 빈 상태 */}
          <div className="p-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-4 bg-gray-100 rounded-full">
                <Search size={40} className="text-gray-400"/>
              </div>
            </div>
            <p className="text-gray-700 font-medium mb-2">No data available</p>
            <p className="text-gray-600 text-sm mb-6">Import Excel file to populate the student database</p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition border border-blue-200">
              <Download size={18}/>
              Import Excel File
            </button>
          </div>
        </div>

        {/* 추가 정보 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 활동 */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 pb-4 border-b border-gray-200">Recent Activities</h3>
            <div className="space-y-4">
              <ActivityItem 
                title="Student Information Updated" 
                description="John Smith's contact information changed"
                time="2 hours ago"
              />
              <ActivityItem 
                title="Attendance Record Submitted" 
                description="April 5, 2024 attendance data entered"
                time="1 day ago"
              />
              <ActivityItem 
                title="Grades Entered" 
                description="Midterm exam grades for Spring semester"
                time="3 days ago"
              />
              <ActivityItem 
                title="Certificate Issued" 
                description="Graduation certificate issued to 15 students"
                time="1 week ago"
              />
            </div>
          </div>

          {/* 학년별 현황 */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 pb-4 border-b border-gray-200">Student Distribution by Grade</h3>
            <div className="space-y-5">
              <GradeBar label="Grade 1" count={85} total={310} />
              <GradeBar label="Grade 2" count={110} total={310} />
              <GradeBar label="Grade 3" count={115} total={310} />
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <span className="font-bold">Total Students:</span> 310
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 text-sm mt-12 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h4 className="text-white font-bold mb-3">About</h4>
              <p className="text-xs leading-relaxed">Myanmar Christianity School Student Information System - Official records management platform</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Quick Links</h4>
              <ul className="text-xs space-y-1">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Support</h4>
              <ul className="text-xs space-y-1">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Report Issue</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs">
            <p>&copy; 2024 Myanmar Christianity School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavMenuItem({ label, icon }) {
  return (
    <button className="px-4 py-3 md:py-4 flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 md:hover:bg-transparent md:border-b-2 md:border-transparent md:hover:border-blue-600 transition font-medium text-sm">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon, color, trend }) {
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
    <div className={`${colorClasses[color]} border rounded-lg p-6 transition-all hover:shadow-lg`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`${iconBg[color]} p-3 rounded-lg ${colorClasses[color].split(' ')[1]}`}>
          {icon}
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-white rounded border border-gray-300 text-gray-600">
          {trend}
        </span>
      </div>
      <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wider">{title}</p>
      <h4 className="text-4xl font-bold text-gray-900">{value}</h4>
    </div>
  );
}

function QuickMenuCard({ title, items, color }) {
  const borderColors = {
    blue: "border-blue-300 bg-blue-50",
    green: "border-green-300 bg-green-50",
    purple: "border-purple-300 bg-purple-50"
  };

  const headerColors = {
    blue: "bg-blue-600 text-white",
    green: "bg-green-600 text-white",
    purple: "bg-purple-600 text-white"
  };

  return (
    <div className={`border-2 ${borderColors[color]} rounded-lg overflow-hidden transition-all hover:shadow-lg`}>
      <div className={`${headerColors[color]} p-4 font-bold text-center`}>
        {title}
      </div>
      <div className="p-4 space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 cursor-pointer group">
            <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition" />
            <span className="group-hover:font-medium transition">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityItem({ title, description, time }) {
  return (
    <div className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
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
        <span className="text-sm font-bold text-gray-900">{count} students</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
