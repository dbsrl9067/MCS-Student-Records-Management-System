"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, FileText, BarChart3, 
  Settings, Search, Bell, CheckCircle, Globe,
  ChevronRight, Download, Plus, Filter, Edit2, 
  Trash2, AlertCircle, Menu, X, Award, BookOpen
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function MyanmarSIS() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    attendanceRate: 0,
    baptizedStudents: 0,
    ethnicGroups: 0
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
    const ethnicGroups = new Set(studentList.map(s => s.ethnicity).filter(Boolean)).size;

    setStats({
      totalStudents,
      attendanceRate: avgAttendance,
      baptizedStudents,
      ethnicGroups
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 상단 네비게이션 - 양곤 대학교 스타일 */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* 로고 및 검색바 */}
        <div className="bg-white px-4 md:px-8 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              M
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">MCS Academy</h1>
              <p className="text-xs text-blue-600 font-semibold">With Truth and Loyalty</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
              <input 
                type="text" 
                placeholder="Enter Your Search" 
                className="bg-transparent outline-none text-sm w-48"
              />
              <button className="p-1 hover:bg-yellow-100 rounded">
                <Search size={18} className="text-yellow-600"/>
              </button>
            </div>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 메인 네비게이션 바 */}
        <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex bg-gradient-to-r from-blue-700 to-blue-900 text-white flex-col md:flex-row`}>
          <NavLink label="HOME" />
          <NavLink label="ABOUT" />
          <NavLink label="DEPARTMENTS" />
          <NavLink label="ADMISSION" />
          <NavLink label="RECORDS" />
          <NavLink label="RESEARCH" />
          <NavLink label="INTERNATIONAL" />
          <NavLink label="MEDIA" />
        </nav>
      </header>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 mx-4 md:mx-8 mt-4 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
        {/* 통계 카드 섹션 - 양곤 대학교 스타일 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents}
            icon={<Users size={32}/>}
            bgColor="from-blue-600 to-blue-700"
            accentColor="bg-yellow-400"
          />
          <StatCard 
            title="Attendance Rate" 
            value={`${stats.attendanceRate}%`}
            icon={<Calendar size={32}/>}
            bgColor="from-green-600 to-green-700"
            accentColor="bg-yellow-400"
          />
          <StatCard 
            title="Baptized Students" 
            value={stats.baptizedStudents}
            icon={<CheckCircle size={32}/>}
            bgColor="from-purple-600 to-purple-700"
            accentColor="bg-yellow-400"
          />
          <StatCard 
            title="Ethnic Groups" 
            value={stats.ethnicGroups}
            icon={<Globe size={32}/>}
            bgColor="from-orange-600 to-orange-700"
            accentColor="bg-yellow-400"
          />
        </div>

        {/* 소개 섹션 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-700">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Student Information System</h2>
          <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Myanmar Christianity School's comprehensive student records management system provides secure, efficient access to academic information. Our system maintains accurate student data, tracks attendance, manages academic records, and facilitates administrative operations with integrity and transparency.
          </p>
          <p className="text-gray-600 text-sm">
            Established to serve the educational mission of MCS Academy, this system ensures all student information is properly documented, easily accessible, and maintained according to the highest standards of data management.
          </p>
        </div>

        {/* 학생 추가 폼 */}
        {showAddForm && (
          <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-700">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Add New Student</h3>
            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Student ID"
                value={formData.student_id}
                onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                required
                className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
              />
              <input
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                required
                className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                required
                className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
              />
              <select
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: parseInt(e.target.value)})}
                className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
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
                className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
              />
              <input
                type="number"
                placeholder="Attendance Rate (%)"
                value={formData.attendance_rate}
                onChange={(e) => setFormData({...formData, attendance_rate: parseFloat(e.target.value)})}
                min="0"
                max="100"
                className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
              />
              <label className="flex items-center gap-2 text-sm text-gray-700">
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
                className="md:col-span-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-bold hover:shadow-lg transition"
              >
                Save Student
              </button>
            </form>
          </div>
        )}

        {/* 학생 목록 섹션 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Student Records</h3>
              <p className="text-blue-100 text-sm mt-1">{students.length} students in the system</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg text-sm font-bold transition">
                <Filter size={16}/>
                Filter
              </button>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg text-sm font-bold transition"
              >
                <Plus size={16}/>
                Add Student
              </button>
            </div>
          </div>

          {/* 테이블 바디 */}
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <p>Loading student data...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-700 font-bold mb-2">No students found</p>
              <p className="text-gray-600 text-sm mb-6">Add your first student to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-blue-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-900 uppercase">Student ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-900 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-900 uppercase">Grade</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-900 uppercase">Ethnicity</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-900 uppercase">Attendance</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-900 uppercase">Baptized</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-900 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student, idx) => (
                    <tr key={student.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-900">{student.student_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.first_name} {student.last_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Grade {student.grade}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.ethnicity || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                              style={{ width: `${student.attendance_rate}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold text-gray-700">{student.attendance_rate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.is_baptized ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {student.is_baptized ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
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

        {/* 통계 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* 학년별 분포 */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-700">
            <h3 className="text-xl font-bold text-blue-900 mb-2">Student Distribution by Grade</h3>
            <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
            <div className="space-y-5">
              {[1, 2, 3].map(grade => {
                const gradeStudents = students.filter(s => s.grade === grade).length;
                const percentage = stats.totalStudents > 0 ? (gradeStudents / stats.totalStudents) * 100 : 0;
                return (
                  <div key={grade}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">Grade {grade}</span>
                      <span className="font-bold text-blue-900">{gradeStudents} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 세례 현황 */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-700">
            <h3 className="text-xl font-bold text-purple-900 mb-2">Baptism Status Overview</h3>
            <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Baptized</p>
                    <p className="text-2xl font-bold text-green-600">{stats.baptizedStudents}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {stats.totalStudents > 0 ? Math.round((stats.baptizedStudents / stats.totalStudents) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full"
                  style={{ width: `${stats.totalStudents > 0 ? (stats.baptizedStudents / stats.totalStudents) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-blue-900 text-white mt-12 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-3 text-yellow-400">About MCS</h4>
              <p className="text-sm text-blue-100 leading-relaxed">Myanmar Christianity School Student Information System - Serving the educational mission with integrity and excellence.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-3 text-yellow-400">Quick Links</h4>
              <ul className="text-sm space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-yellow-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-3 text-yellow-400">Contact</h4>
              <p className="text-sm text-blue-100">+95 (9) 8602057</p>
              <p className="text-sm text-blue-100">info@mcs.edu.mm</p>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-6 text-center text-sm text-blue-200">
            <p>&copy; 2024 Myanmar Christianity School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ label }) {
  return (
    <button className="px-4 md:px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition font-semibold text-sm border-b-2 border-transparent hover:border-yellow-400">
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, bgColor, accentColor }) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-lg shadow-lg p-6 text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
      <div className="relative z-10">
        <div className={`${accentColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-900`}>
          {icon}
        </div>
        <p className="text-blue-100 text-sm font-semibold mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-4xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );
}
