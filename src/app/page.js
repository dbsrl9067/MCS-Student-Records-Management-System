"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, FileText, BarChart3, 
  Settings, Search, Bell, CheckCircle, Globe,
  ChevronRight, Download, Plus, Filter, Eye,
  Menu, X, Edit2, Trash2, Save, AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function MyanmarSIS() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    attendanceRate: 0,
    baptizedStudents: 0,
    ethnicGroups: new Set()
  });
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    grade: 1,
    gender: 'Male',
    ethnicity: '',
    is_baptized: false,
    attendance_rate: 85
  });

  // Fetch students from Supabase
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .order('student_id', { ascending: true });

      if (fetchError) throw fetchError;

      setStudents(data || []);
      calculateStats(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (studentList) => {
    const totalStudents = studentList.length;
    const baptizedStudents = studentList.filter(s => s.is_baptized).length;
    const avgAttendance = studentList.length > 0 
      ? (studentList.reduce((sum, s) => sum + (s.attendance_rate || 0), 0) / studentList.length).toFixed(0)
      : 0;
    const ethnicGroups = new Set(studentList.map(s => s.ethnicity).filter(Boolean));

    setStats({
      totalStudents,
      attendanceRate: avgAttendance,
      baptizedStudents,
      ethnicGroups: ethnicGroups.size
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const { data, error: insertError } = await supabase
        .from('students')
        .insert([formData])
        .select();

      if (insertError) throw insertError;

      setStudents([...students, ...data]);
      calculateStats([...students, ...data]);
      setFormData({
        student_id: '',
        first_name: '',
        last_name: '',
        grade: 1,
        gender: 'Male',
        ethnicity: '',
        is_baptized: false,
        attendance_rate: 85
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding student:', err);
      setError(err.message || 'Failed to add student');
    }
  };

  const handleUpdateStudent = async (id) => {
    try {
      const studentToUpdate = students.find(s => s.id === id);
      const { error: updateError } = await supabase
        .from('students')
        .update(studentToUpdate)
        .eq('id', id);

      if (updateError) throw updateError;

      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error('Error updating student:', err);
      setError(err.message || 'Failed to update student');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setStudents(students.filter(s => s.id !== id));
      calculateStats(students.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(err.message || 'Failed to delete student');
    }
  };

  const handleStudentChange = (id, field, value) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
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

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

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

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-4 md:mx-8 mt-4 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
        {/* 통계 카드 섹션 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents} 
            icon={<Users size={28}/>}
            color="blue"
            trend={`${stats.totalStudents} enrolled`}
          />
          <StatCard 
            title="Attendance Rate" 
            value={`${stats.attendanceRate}%`} 
            icon={<Calendar size={28}/>}
            color="green"
            trend="Average"
          />
          <StatCard 
            title="Baptized Students" 
            value={stats.baptizedStudents} 
            icon={<CheckCircle size={28}/>}
            color="purple"
            trend={`${stats.totalStudents > 0 ? Math.round((stats.baptizedStudents / stats.totalStudents) * 100) : 0}% of total`}
          />
          <StatCard 
            title="Ethnic Groups" 
            value={stats.ethnicGroups} 
            icon={<Globe size={28}/>}
            color="orange"
            trend="Diversity"
          />
        </div>

        {/* 퀵 메뉴 섹션 */}
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

        {/* 학생 목록 섹션 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-8">
          {/* 헤더 */}
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50">
            <div>
              <h3 className="font-bold text-lg text-gray-900">Student Records</h3>
              <p className="text-sm text-gray-600 mt-1">{students.length} students in the system</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex-1 md:flex-none justify-center">
                <Filter size={16}/>
                Filter
              </button>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex-1 md:flex-none justify-center"
              >
                <Plus size={16}/>
                Add Student
              </button>
            </div>
          </div>

          {/* 추가 폼 */}
          {showAddForm && (
            <div className="p-6 border-b border-gray-200 bg-blue-50">
              <h4 className="font-bold text-gray-900 mb-4">Add New Student</h4>
              <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Student ID"
                  value={formData.student_id}
                  onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: parseInt(e.target.value)})}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value={1}>Grade 1</option>
                  <option value={2}>Grade 2</option>
                  <option value={3}>Grade 3</option>
                </select>
                <input
                  type="text"
                  placeholder="Ethnicity"
                  value={formData.ethnicity}
                  onChange={(e) => setFormData({...formData, ethnicity: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Attendance Rate (%)"
                  value={formData.attendance_rate}
                  onChange={(e) => setFormData({...formData, attendance_rate: parseFloat(e.target.value)})}
                  min="0"
                  max="100"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.is_baptized}
                    onChange={(e) => setFormData({...formData, is_baptized: e.target.checked})}
                    className="w-4 h-4"
                  />
                  Baptized
                </label>
                <button
                  type="submit"
                  className="md:col-span-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                >
                  Save Student
                </button>
              </form>
            </div>
          )}

          {/* 테이블 바디 */}
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <p>Loading student data...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Search size={40} className="text-gray-400"/>
                </div>
              </div>
              <p className="text-gray-700 font-medium mb-2">No students found</p>
              <p className="text-gray-600 text-sm mb-6">Add your first student to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ethnicity</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Attendance</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Baptized</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{student.student_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.first_name} {student.last_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">Grade {student.grade}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.ethnicity || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.attendance_rate}%</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.is_baptized ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {student.is_baptized ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => setEditingId(editingId === student.id ? null : student.id)}
                          className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 추가 정보 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 학년별 분포 */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 pb-4 border-b border-gray-200">Student Distribution by Grade</h3>
            <div className="space-y-5">
              {[1, 2, 3].map(grade => {
                const gradeStudents = students.filter(s => s.grade === grade).length;
                return (
                  <GradeBar 
                    key={grade}
                    label={`Grade ${grade}`} 
                    count={gradeStudents} 
                    total={stats.totalStudents} 
                  />
                );
              })}
            </div>
          </div>

          {/* 세례 현황 */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 pb-4 border-b border-gray-200">Baptism Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Baptized Students</span>
                <span className="text-2xl font-bold text-green-600">{stats.baptizedStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Not Baptized</span>
                <span className="text-2xl font-bold text-gray-600">{stats.totalStudents - stats.baptizedStudents}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                  style={{ width: `${stats.totalStudents > 0 ? (stats.baptizedStudents / stats.totalStudents) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center mt-2">
                {stats.totalStudents > 0 ? Math.round((stats.baptizedStudents / stats.totalStudents) * 100) : 0}% baptized
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
              <p className="text-xs leading-relaxed">Myanmar Christianity School Student Information System - Official records management platform powered by Supabase</p>
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

function GradeBar({ label, count, total }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
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
