"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

// ──────────────────────────────────────────────
// 학생 상세 정보 모달
// ──────────────────────────────────────────────
function StudentDetailModal({ student, onClose, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...student });
  const [saving, setSaving] = useState(false);

  const field = (label, key, type = 'text', options = null) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#003366', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      {editing ? (
        options ? (
          <select
            value={form[key] || ''}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #003366', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
          >
            {options.map(o => <option key={o} value={o}>{o || '—'}</option>)}
          </select>
        ) : type === 'checkbox' ? (
          <input type="checkbox" checked={!!form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} />
        ) : (
          <input
            type={type}
            value={form[key] || ''}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #003366', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
          />
        )
      ) : (
        <div style={{ fontSize: '14px', color: '#333', padding: '4px 0' }}>
          {key === 'is_baptized' ? (student[key] ? '✅ 세례 받음' : '—') : (student[key] || '—')}
        </div>
      )}
    </div>
  );

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('students').update(form).eq('id', student.id);
    setSaving(false);
    if (error) { alert('저장 실패: ' + error.message); return; }
    onUpdate(form);
    setEditing(false);
  };

  const getAgeCategory = (age) => {
    if (!age) return '';
    if (age >= 3 && age <= 5) return 'Kindergarten';
    if (age >= 6 && age <= 11) return 'Elementary';
    if (age >= 12 && age <= 14) return 'Middle School';
    if (age >= 15 && age <= 18) return 'High School';
    return 'Other';
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        {/* 모달 헤더 */}
        <div style={{
          background: 'linear-gradient(135deg, #003366 0%, #0055A4 100%)',
          color: 'white',
          padding: '24px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          borderRadius: '8px 8px 0 0'
        }}>
          {/* 학생 사진 */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            border: '3px solid #FFD700',
            backgroundImage: student.photo_url ? `url(${student.photo_url})` : 'none',
            backgroundSize: 'cover', backgroundPosition: 'center',
            backgroundColor: '#1a4a7a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', flexShrink: 0
          }}>
            {!student.photo_url && '👤'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
              {student.first_name} {student.last_name}
            </div>
            <div style={{ fontSize: '13px', color: '#FFD700', fontWeight: 'bold' }}>
              {student.student_id} &nbsp;·&nbsp; {getAgeCategory(student.age)}
            </div>
            <div style={{ fontSize: '12px', color: '#ccc', marginTop: '2px' }}>
              {student.ethnicity || ''}{student.religion ? ` · ${student.religion}` : ''}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving} style={{
                  padding: '8px 16px', backgroundColor: '#FFD700', color: '#003366',
                  border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
                }}>
                  {saving ? '저장 중...' : '💾 저장'}
                </button>
                <button onClick={() => { setForm({ ...student }); setEditing(false); }} style={{
                  padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',
                  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
                }}>취소</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} style={{
                padding: '8px 16px', backgroundColor: '#FFD700', color: '#003366',
                border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
              }}>✏️ 수정</button>
            )}
            <button onClick={onClose} style={{
              padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white',
              border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px'
            }}>✕</button>
          </div>
        </div>

        {/* 모달 본문 */}
        <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>

          {/* ── 기본 정보 ── */}
          <div>
            <SectionTitle>📋 기본 정보</SectionTitle>
            {field('학번 (Student ID)', 'student_id')}
            {field('성 (First Name)', 'first_name')}
            {field('이름 (Last Name)', 'last_name')}
            {field('나이', 'age', 'number')}
            {field('성별', 'gender', 'text', editing ? ['Male', 'Female', ''] : null)}
            {field('학년 (Grade)', 'grade', 'number')}
            {field('입학일', 'admission_date', 'date')}
          </div>

          {/* ── 배경 정보 ── */}
          <div>
            <SectionTitle>🌏 배경 정보</SectionTitle>
            {field('부족 / 민족 (Ethnicity)', 'ethnicity')}
            {field('종교 (Religion)', 'religion', 'text', editing ? ['Christian', 'Buddhist', 'Muslim', 'Hindu', 'Animist', 'Other', ''] : null)}
            {field('NRC 번호', 'nrc_no')}
            {field('지역 센터', 'regional_centre')}
            {field('전공 / 특기', 'specialization')}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#003366', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                세례 여부 (Baptized)
              </label>
              {editing ? (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!form.is_baptized} onChange={e => setForm({ ...form, is_baptized: e.target.checked })} />
                  세례 받음
                </label>
              ) : (
                <div style={{ fontSize: '14px', color: student.is_baptized ? '#2e7d32' : '#999' }}>
                  {student.is_baptized ? '✅ 세례 받음' : '—'}
                </div>
              )}
            </div>
          </div>

          {/* ── 가족 관계 ── */}
          <div>
            <SectionTitle>👨‍👩‍👧 가족 관계</SectionTitle>
            {field('부친 이름 (Father)', 'father_name')}
            {field('모친 이름 (Mother)', 'mother_name')}
            {field('보호자 연락처', 'guardian_phone', 'tel')}
            {field('주소', 'address')}
          </div>

          {/* ── 학업 정보 ── */}
          <div>
            <SectionTitle>📚 학업 정보</SectionTitle>
            {field('출석률 (%)', 'attendance_rate', 'number')}
            {field('수강 과목', 'enrolled_subjects')}
            {field('Roll No.', 'roll_no')}
            {field('등록 번호 (Reg No.)', 'reg_no')}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#003366', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                성적 메모
              </label>
              {editing ? (
                <textarea
                  value={form.grades_note || ''}
                  onChange={e => setForm({ ...form, grades_note: e.target.value })}
                  placeholder="예: Math A, Science B+, English A-"
                  rows={3}
                  style={{ width: '100%', padding: '8px', border: '1px solid #003366', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              ) : (
                <div style={{ fontSize: '13px', color: '#333', whiteSpace: 'pre-wrap', padding: '4px 0' }}>
                  {student.grades_note || '—'}
                </div>
              )}
            </div>
          </div>

          {/* ── 사진 URL (수정 모드에서만) ── */}
          {editing && (
            <div style={{ gridColumn: 'span 2' }}>
              <SectionTitle>🖼️ 프로필 사진</SectionTitle>
              {field('사진 URL (Photo URL)', 'photo_url')}
            </div>
          )}
        </div>

        {/* 출석률 현황 바 */}
        {student.attendance_rate != null && (
          <div style={{ padding: '0 30px 30px' }}>
            <div style={{ backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#003366' }}>출석률</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: student.attendance_rate >= 80 ? '#2e7d32' : '#c62828' }}>
                  {student.attendance_rate}%
                </span>
              </div>
              <div style={{ height: '10px', backgroundColor: '#ddd', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                  width: `${student.attendance_rate}%`,
                  height: '100%',
                  backgroundColor: student.attendance_rate >= 80 ? '#4CAF50' : '#f44336',
                  borderRadius: '5px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: '13px', fontWeight: 'bold', color: '#003366',
      borderBottom: '2px solid #FFD700',
      paddingBottom: '6px', marginBottom: '14px', marginTop: '4px'
    }}>
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────
// 메인 컴포넌트
// ──────────────────────────────────────────────
export default function MyanmarSIS() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('records');
  const [staffFilter, setStaffFilter] = useState('all');

  // Auth
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Data
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // 학생 상세 모달
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filter
  const [ageFilter, setAgeFilter] = useState('all');

  // Calendar
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [eventCategories, setEventCategories] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [showCalendarEventModal, setShowCalendarEventModal] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', color: '#FFD700' });
  const [eventFormData, setEventFormData] = useState({ title: '', description: '', start_date: '', end_date: '', category: 'Academic' });

  // Certificate
  const [selectedStudentForCert, setSelectedStudentForCert] = useState(null);
  const [certificateType, setCertificateType] = useState(null);

  // Stats
  const [stats, setStats] = useState({ totalStudents: 0, totalFaculty: 0, totalStaff: 0, attendanceRate: 0, baptizedStudents: 0, kindergarten: 0, elementary: 0, middle: 0, high: 0 });

  // ── 신규 등록 폼 (출석률 제거) ──
  const [formData, setFormData] = useState({
    student_id: '', first_name: '', last_name: '',
    age: '', grade: 1, gender: 'Male', ethnicity: '',
    religion: '', father_name: '', mother_name: '',
    guardian_phone: '', address: '', is_baptized: false,
    admission_date: '', roll_no: '', reg_no: '', nrc_no: '',
    regional_centre: '', specialization: '',
    enrolled_subjects: '', photo_url: ''
    // attendance_rate 는 나중에 상세 정보에서 별도 입력
  });

  const [staffFormData, setStaffFormData] = useState({
    staff_id: '', first_name: '', last_name: '',
    is_faculty: true, role: 'Teacher', department: '',
    subjects: '', classes: '', job_title: '',
    contact_email: '', contact_phone: '', photo_url: ''
  });

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push('/login'); }
        else { setUser(session.user); }
      } catch { router.push('/login'); }
      finally { setAuthLoading(false); }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (user) { fetchData(); fetchCalendarEvents(); fetchEventCategories(); }
  }, [user]);

  const fetchCalendarEvents = async () => {
    const { data } = await supabase.from('calendar_events').select('*').order('start_date', { ascending: true });
    setCalendarEvents(data || []);
  };

  const fetchEventCategories = async () => {
    const { data } = await supabase.from('event_categories').select('*').order('name', { ascending: true });
    setEventCategories(data || []);
  };

  const addEventCategory = async () => {
    if (!newCategoryData.name.trim()) { alert('카테고리 이름을 입력하세요'); return; }
    await supabase.from('event_categories').insert([{ name: newCategoryData.name, color: newCategoryData.color }]);
    fetchEventCategories();
    setNewCategoryData({ name: '', color: '#FFD700' });
  };

  const deleteEventCategory = async (id) => {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('event_categories').delete().eq('id', id);
    fetchEventCategories();
  };

  const fetchData = async () => {
    try {
      setLoading(true); setError(null);
      const { data: studentsData, error: sErr } = await supabase.from('students').select('*').order('student_id', { ascending: true });
      const { data: staffData, error: stErr } = await supabase.from('staff').select('*').order('staff_id', { ascending: true });
      if (sErr) throw sErr;
      if (stErr) throw stErr;
      setStudents(studentsData || []);
      setStaff(staffData || []);
      calculateStats(studentsData || [], staffData || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally { setLoading(false); }
  };

  const calculateStats = (studentList, staffList) => {
    const totalStudents = studentList.length;
    const totalFaculty = staffList.filter(s => s.is_faculty).length;
    const totalStaffCount = staffList.filter(s => !s.is_faculty).length;
    const withAttendance = studentList.filter(s => s.attendance_rate != null);
    const avgAttendance = withAttendance.length > 0
      ? (withAttendance.reduce((sum, s) => sum + (s.attendance_rate || 0), 0) / withAttendance.length).toFixed(0)
      : '—';
    const baptizedStudents = studentList.filter(s => s.is_baptized).length;
    setStats({
      totalStudents, totalFaculty, totalStaff: totalStaffCount, attendanceRate: avgAttendance, baptizedStudents,
      kindergarten: studentList.filter(s => s.age >= 3 && s.age <= 5).length,
      elementary: studentList.filter(s => s.age >= 6 && s.age <= 11).length,
      middle: studentList.filter(s => s.age >= 12 && s.age <= 14).length,
      high: studentList.filter(s => s.age >= 15 && s.age <= 18).length,
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.age === '') delete payload.age;
      // attendance_rate 미포함 (나중에 상세에서 입력)
      const { data, error: insertError } = await supabase.from('students').insert([payload]).select();
      if (insertError) throw insertError;
      const updated = [...students, ...data];
      setStudents(updated);
      calculateStats(updated, staff);
      setFormData({
        student_id: '', first_name: '', last_name: '',
        age: '', grade: 1, gender: 'Male', ethnicity: '',
        religion: '', father_name: '', mother_name: '',
        guardian_phone: '', address: '', is_baptized: false,
        admission_date: '', roll_no: '', reg_no: '', nrc_no: '',
        regional_centre: '', specialization: '',
        enrolled_subjects: '', photo_url: ''
      });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || 'Failed to add student');
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const { data, error: insertError } = await supabase.from('staff').insert([staffFormData]).select();
      if (insertError) throw insertError;
      const updated = [...staff, ...data];
      setStaff(updated);
      calculateStats(students, updated);
      setStaffFormData({ staff_id: '', first_name: '', last_name: '', is_faculty: true, role: 'Teacher', department: '', subjects: '', classes: '', job_title: '', contact_email: '', contact_phone: '', photo_url: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || 'Failed to add staff');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    const { error: deleteError } = await supabase.from('students').delete().eq('id', id);
    if (deleteError) { setError(deleteError.message); return; }
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    calculateStats(updated, staff);
    if (selectedStudent?.id === id) setSelectedStudent(null);
  };

  const handleDeleteStaff = async (id) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    const { error: deleteError } = await supabase.from('staff').delete().eq('id', id);
    if (deleteError) { setError(deleteError.message); return; }
    const updated = staff.filter(s => s.id !== id);
    setStaff(updated);
    calculateStats(students, updated);
  };

  // 학생 상세 정보 업데이트 콜백
  const handleStudentUpdate = (updatedStudent) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    calculateStats(updated, staff);
    setSelectedStudent(updatedStudent);
  };

  const getAgeCategory = (age) => {
    if (!age) return 'Unknown';
    if (age >= 3 && age <= 5) return 'Kindergarten';
    if (age >= 6 && age <= 11) return 'Elementary';
    if (age >= 12 && age <= 14) return 'Middle School';
    if (age >= 15 && age <= 18) return 'High School';
    return 'Other';
  };

  const getFilteredStudents = () => {
    if (ageFilter === 'all') return students;
    if (ageFilter === 'kindergarten') return students.filter(s => s.age >= 3 && s.age <= 5);
    if (ageFilter === 'elementary') return students.filter(s => s.age >= 6 && s.age <= 11);
    if (ageFilter === 'middle') return students.filter(s => s.age >= 12 && s.age <= 14);
    if (ageFilter === 'high') return students.filter(s => s.age >= 15 && s.age <= 18);
    return students;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#666' }}>Loading...</p>
      </div>
    </div>
  );
  if (!user) return null;

  // ──── 인풋 스타일 ────
  const inputStyle = { padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', width: '100%' };
  const formGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>

      {/* 학생 상세 모달 */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdate={handleStudentUpdate}
        />
      )}

      {/* HEADER */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#003366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 'bold' }}>M</div>
            <div>
              <h1 style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#003366' }}>MCS Academy</h1>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>With Truth and Loyalty</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
              <p style={{ margin: '0 0 3px 0', fontWeight: 'bold' }}>Admin:</p>
              <p style={{ margin: '0', color: '#003366', fontSize: '11px' }}>{user?.email}</p>
            </div>
            <button onClick={() => setShowLogoutConfirm(true)} style={{ padding: '8px 16px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Logout</button>
          </div>
        </div>
      </div>

      {/* Logout 확인 모달 */}
      {showLogoutConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', maxWidth: '400px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#003366' }}>Confirm Logout</h3>
            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '14px' }}>Are you sure you want to logout?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ padding: '8px 16px', backgroundColor: '#ddd', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <div style={{ backgroundColor: '#003366', borderBottom: '3px solid #FFD700' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', padding: '0 20px' }}>
          {[
            { label: 'HOME', section: 'home' },
            { label: 'STUDENT RECORDS', section: 'records' },
            { label: 'FACULTY', section: 'faculty' },
            { label: 'STAFF', section: 'staff' },
            { label: 'CALENDAR', section: 'calendar' },
            { label: 'CERTIFICATES', section: 'certificates' },
            { label: 'ABOUT', section: 'about' }
          ].map(item => (
            <button key={item.section} onClick={() => setActiveSection(item.section)} style={{
              color: activeSection === item.section ? '#FFD700' : 'white',
              padding: '15px 16px', fontSize: '12px', fontWeight: 'bold',
              borderBottom: activeSection === item.section ? '3px solid #FFD700' : '3px solid transparent',
              cursor: 'pointer', background: 'none', border: 'none', transition: 'all 0.3s'
            }}>{item.label}</button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {error && (
          <div style={{ backgroundColor: '#fee', border: '2px solid #f00', color: '#c00', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>
        )}

        {/* ── HOME ── */}
        {activeSection === 'home' && (
          <>
            <div style={{ backgroundColor: '#003366', color: 'white', padding: '60px 40px', borderRadius: '4px', marginBottom: '40px', backgroundImage: 'linear-gradient(135deg, #003366 0%, #0055A4 100%)' }}>
              <h2 style={{ fontSize: '36px', margin: '0 0 10px 0', fontWeight: 'bold' }}>Member Information System</h2>
              <p style={{ fontSize: '16px', margin: '0', color: '#e0e0e0' }}>Myanmar Christianity School — Official Student & Staff Records Management</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <StatCard title="Total Students" value={stats.totalStudents} icon="👥" />
              <StatCard title="Faculty Members" value={stats.totalFaculty} icon="👨‍🏫" />
              <StatCard title="Staff Members" value={stats.totalStaff} icon="👔" />
              <StatCard title="Avg Attendance" value={`${stats.attendanceRate}%`} icon="📊" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <InfoBox title="Kindergarten" value={stats.kindergarten} color="#FF6B6B" />
              <InfoBox title="Elementary" value={stats.elementary} color="#4ECDC4" />
              <InfoBox title="Middle School" value={stats.middle} color="#45B7D1" />
              <InfoBox title="High School" value={stats.high} color="#96CEB4" />
            </div>
          </>
        )}

        {/* ── STUDENT RECORDS ── */}
        {activeSection === 'records' && (
          <>
            {/* 연령 필터 */}
            <div style={{ backgroundColor: '#e8f4f8', border: '2px solid #003366', padding: '20px', borderRadius: '4px', marginBottom: '30px' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#003366' }}>Filter by Age Group</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Kindergarten (3-5)', value: 'kindergarten' },
                  { label: 'Elementary (6-11)', value: 'elementary' },
                  { label: 'Middle School (12-14)', value: 'middle' },
                  { label: 'High School (15-18)', value: 'high' }
                ].map(f => (
                  <button key={f.value} onClick={() => setAgeFilter(f.value)} style={{
                    padding: '8px 16px',
                    backgroundColor: ageFilter === f.value ? '#003366' : 'white',
                    color: ageFilter === f.value ? 'white' : '#003366',
                    border: '2px solid #003366', borderRadius: '4px', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 'bold', transition: 'all 0.3s'
                  }}>{f.label}</button>
                ))}
              </div>
            </div>

            {/* 신규 등록 폼 (출석률 제거) */}
            {showAddForm && (
              <div style={{ backgroundColor: '#e8f4f8', border: '2px solid #003366', padding: '20px', borderRadius: '4px', marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#003366' }}>신규 학생 등록</h3>
                <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>※ 출석률은 등록 후 학생 상세 정보에서 입력할 수 있습니다.</p>
                <form onSubmit={handleAddStudent} style={formGrid}>
                  <input placeholder="Student ID *" value={formData.student_id} onChange={e => setFormData({...formData, student_id: e.target.value})} required style={inputStyle} />
                  <input placeholder="First Name *" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required style={inputStyle} />
                  <input placeholder="Last Name *" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required style={inputStyle} />
                  <input type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value ? parseInt(e.target.value) : ''})} min="3" max="100" style={inputStyle} />
                  <input type="number" placeholder="Grade" value={formData.grade} onChange={e => setFormData({...formData, grade: parseInt(e.target.value)})} min="1" max="12" style={inputStyle} />
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} style={inputStyle}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input placeholder="Ethnicity" value={formData.ethnicity} onChange={e => setFormData({...formData, ethnicity: e.target.value})} style={inputStyle} />
                  <select value={formData.religion} onChange={e => setFormData({...formData, religion: e.target.value})} style={inputStyle}>
                    <option value="">Religion (선택)</option>
                    <option value="Christian">Christian</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Animist">Animist</option>
                    <option value="Other">Other</option>
                  </select>
                  <input placeholder="Father's Name" value={formData.father_name} onChange={e => setFormData({...formData, father_name: e.target.value})} style={inputStyle} />
                  <input placeholder="Mother's Name" value={formData.mother_name} onChange={e => setFormData({...formData, mother_name: e.target.value})} style={inputStyle} />
                  <input placeholder="Guardian Phone" value={formData.guardian_phone} onChange={e => setFormData({...formData, guardian_phone: e.target.value})} style={inputStyle} />
                  <input placeholder="Roll No." value={formData.roll_no} onChange={e => setFormData({...formData, roll_no: e.target.value})} style={inputStyle} />
                  <input placeholder="Reg No." value={formData.reg_no} onChange={e => setFormData({...formData, reg_no: e.target.value})} style={inputStyle} />
                  <input placeholder="NRC No." value={formData.nrc_no} onChange={e => setFormData({...formData, nrc_no: e.target.value})} style={inputStyle} />
                  <input placeholder="Regional Centre" value={formData.regional_centre} onChange={e => setFormData({...formData, regional_centre: e.target.value})} style={inputStyle} />
                  <input placeholder="Specialization" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} style={inputStyle} />
                  <input placeholder="Enrolled Subjects" value={formData.enrolled_subjects} onChange={e => setFormData({...formData, enrolled_subjects: e.target.value})} style={inputStyle} />
                  <input type="date" placeholder="Admission Date" value={formData.admission_date} onChange={e => setFormData({...formData, admission_date: e.target.value})} style={inputStyle} />
                  <input placeholder="Photo URL" value={formData.photo_url} onChange={e => setFormData({...formData, photo_url: e.target.value})} style={inputStyle} />
                  <input placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={inputStyle} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <input type="checkbox" checked={formData.is_baptized} onChange={e => setFormData({...formData, is_baptized: e.target.checked})} />
                    세례 (Baptized)
                  </label>
                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, padding: '12px 20px', backgroundColor: '#FFD700', color: '#003366', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                      저장
                    </button>
                    <button type="button" onClick={() => setShowAddForm(false)} style={{ padding: '12px 20px', backgroundColor: '#ddd', color: '#333', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                      취소
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 학생 목록 테이블 */}
            <div style={{ backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#003366', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Student Records</h3>
                  <p style={{ margin: '0', fontSize: '12px', color: '#ccc' }}>{getFilteredStudents().length} students · 행을 클릭하면 상세 정보를 볼 수 있습니다</p>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '10px 20px', backgroundColor: '#FFD700', color: '#003366', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                  + Add Student
                </button>
              </div>

              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</div>
              ) : getFilteredStudents().length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No students found.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #003366' }}>
                      {['', 'Student ID', 'Name', 'Age', 'Category', 'Ethnicity', 'Religion', 'Attendance', 'Baptized', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px', textAlign: h === 'Actions' ? 'center' : 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredStudents().map((student, idx) => (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? 'white' : '#f9f9f9', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e8f4f8'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'white' : '#f9f9f9'}
                      >
                        {/* 미니 아바타 */}
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            backgroundColor: '#003366',
                            backgroundImage: student.photo_url ? `url(${student.photo_url})` : 'none',
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '16px', flexShrink: 0
                          }}>
                            {!student.photo_url && '👤'}
                          </div>
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold', color: '#003366' }}>{student.student_id}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{student.first_name} {student.last_name}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{student.age || '—'}</td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{getAgeCategory(student.age)}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>{student.ethnicity || '—'}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>{student.religion || '—'}</td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>
                          {student.attendance_rate != null ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '50px', height: '6px', backgroundColor: '#ddd', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${student.attendance_rate}%`, height: '100%', backgroundColor: student.attendance_rate >= 80 ? '#4CAF50' : '#f44336' }} />
                              </div>
                              <span>{student.attendance_rate}%</span>
                            </div>
                          ) : <span style={{ color: '#bbb', fontSize: '12px' }}>미입력</span>}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: '3px', backgroundColor: student.is_baptized ? '#c8e6c9' : '#f5f5f5', color: student.is_baptized ? '#2e7d32' : '#999', fontSize: '12px', fontWeight: 'bold' }}>
                            {student.is_baptized ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleDeleteStudent(student.id)} style={{ padding: '6px 10px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── FACULTY ── */}
        {activeSection === 'faculty' && (
          <>
            {showAddForm && (
              <div style={{ backgroundColor: '#e8f4f8', border: '2px solid #003366', padding: '20px', borderRadius: '4px', marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#003366' }}>Add New Faculty Member</h3>
                <form onSubmit={handleAddStaff} style={formGrid}>
                  <input placeholder="Staff ID *" value={staffFormData.staff_id} onChange={e => setStaffFormData({...staffFormData, staff_id: e.target.value})} required style={inputStyle} />
                  <input placeholder="First Name *" value={staffFormData.first_name} onChange={e => setStaffFormData({...staffFormData, first_name: e.target.value})} required style={inputStyle} />
                  <input placeholder="Last Name *" value={staffFormData.last_name} onChange={e => setStaffFormData({...staffFormData, last_name: e.target.value})} required style={inputStyle} />
                  <input placeholder="Subjects" value={staffFormData.subjects} onChange={e => setStaffFormData({...staffFormData, subjects: e.target.value})} style={inputStyle} />
                  <input placeholder="Classes" value={staffFormData.classes} onChange={e => setStaffFormData({...staffFormData, classes: e.target.value})} style={inputStyle} />
                  <input placeholder="Department" value={staffFormData.department} onChange={e => setStaffFormData({...staffFormData, department: e.target.value})} style={inputStyle} />
                  <input type="email" placeholder="Email" value={staffFormData.contact_email} onChange={e => setStaffFormData({...staffFormData, contact_email: e.target.value})} style={inputStyle} />
                  <input placeholder="Phone" value={staffFormData.contact_phone} onChange={e => setStaffFormData({...staffFormData, contact_phone: e.target.value})} style={inputStyle} />
                  <input placeholder="Photo URL" value={staffFormData.photo_url} onChange={e => setStaffFormData({...staffFormData, photo_url: e.target.value})} style={inputStyle} />
                  <div style={{ gridColumn: 'span 2' }}>
                    <button type="submit" style={{ padding: '12px 30px', backgroundColor: '#FFD700', color: '#003366', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Save</button>
                  </div>
                </form>
              </div>
            )}
            <div style={{ backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#003366', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Faculty Directory</h3>
                  <p style={{ margin: '0', fontSize: '12px', color: '#ccc' }}>{staff.filter(s => s.is_faculty).length} faculty members</p>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '10px 20px', backgroundColor: '#FFD700', color: '#003366', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Faculty</button>
              </div>
              {loading ? <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
                  {staff.filter(s => s.is_faculty).map(member => (
                    <FacultyCard key={member.id} member={member} onDelete={() => handleDeleteStaff(member.id)} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── STAFF ── */}
        {activeSection === 'staff' && (
          <>
            {showAddForm && (
              <div style={{ backgroundColor: '#e8f4f8', border: '2px solid #003366', padding: '20px', borderRadius: '4px', marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#003366' }}>Add New Staff Member</h3>
                <form onSubmit={e => { setStaffFormData({...staffFormData, is_faculty: false}); handleAddStaff(e); }} style={formGrid}>
                  <input placeholder="Staff ID *" value={staffFormData.staff_id} onChange={e => setStaffFormData({...staffFormData, staff_id: e.target.value, is_faculty: false})} required style={inputStyle} />
                  <input placeholder="First Name *" value={staffFormData.first_name} onChange={e => setStaffFormData({...staffFormData, first_name: e.target.value})} required style={inputStyle} />
                  <input placeholder="Last Name *" value={staffFormData.last_name} onChange={e => setStaffFormData({...staffFormData, last_name: e.target.value})} required style={inputStyle} />
                  <input placeholder="Job Title" value={staffFormData.job_title} onChange={e => setStaffFormData({...staffFormData, job_title: e.target.value})} style={inputStyle} />
                  <input placeholder="Department" value={staffFormData.department} onChange={e => setStaffFormData({...staffFormData, department: e.target.value})} style={inputStyle} />
                  <input type="email" placeholder="Email" value={staffFormData.contact_email} onChange={e => setStaffFormData({...staffFormData, contact_email: e.target.value})} style={inputStyle} />
                  <input placeholder="Phone" value={staffFormData.contact_phone} onChange={e => setStaffFormData({...staffFormData, contact_phone: e.target.value})} style={inputStyle} />
                  <div style={{ gridColumn: 'span 2' }}>
                    <button type="submit" style={{ padding: '12px 30px', backgroundColor: '#FFD700', color: '#003366', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Save</button>
                  </div>
                </form>
              </div>
            )}
            <div style={{ backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#003366', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>Staff Directory</h3>
                  <p style={{ margin: '0', fontSize: '12px', color: '#ccc' }}>{staff.filter(s => !s.is_faculty).length} staff members</p>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '10px 20px', backgroundColor: '#FFD700', color: '#003366', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Staff</button>
              </div>
              {loading ? <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #003366' }}>
                      {['Staff ID', 'Name', 'Job Title', 'Department', 'Email', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {staff.filter(s => !s.is_faculty).map((member, idx) => (
                      <tr key={member.id} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? 'white' : '#f9f9f9' }}>
                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold', color: '#003366' }}>{member.staff_id}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{member.first_name} {member.last_name}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{member.job_title || '—'}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>{member.department || '—'}</td>
                        <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>{member.contact_email || '—'}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => handleDeleteStaff(member.id)} style={{ padding: '6px 10px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── CALENDAR ── */}
        {activeSection === 'calendar' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #FFD700' }}>
              <button onClick={() => setShowCategoryManagement(true)} style={{ padding: '8px 12px', backgroundColor: '#FFD700', color: '#003366', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>⚙️ Manage Categories</button>
              <button onClick={() => { const d = new Date(calendarMonth); d.setMonth(d.getMonth() - 1); setCalendarMonth(d); }} style={{ padding: '8px 12px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>← Previous</button>
              <h2 style={{ color: '#003366', margin: '0', fontSize: '24px' }}>
                {['January','February','March','April','May','June','July','August','September','October','November','December'][calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
              </h2>
              <button onClick={() => { const d = new Date(calendarMonth); d.setMonth(d.getMonth() + 1); setCalendarMonth(d); }} style={{ padding: '8px 12px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Next →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#ddd', marginBottom: '1px' }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} style={{ backgroundColor: '#003366', color: 'white', padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }}>{d}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#ddd' }}>
              {(() => {
                const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
                const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
                const days = [];
                for (let i = 0; i < firstDay; i++) days.push(null);
                for (let i = 1; i <= daysInMonth; i++) days.push(i);
                return days.map((day, index) => {
                  const isCurrentMonth = day !== null;
                  const dateObj = isCurrentMonth ? new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day) : null;
                  const eventsOnDate = isCurrentMonth ? calendarEvents.filter(e => {
                    const ed = new Date(e.start_date);
                    return ed.toDateString() === dateObj.toDateString();
                  }) : [];
                  return (
                    <div key={index} onClick={() => { if (isCurrentMonth) { setSelectedCalendarDate(dateObj); setShowCalendarEventModal(true); } }}
                      style={{ backgroundColor: isCurrentMonth ? 'white' : '#f5f5f5', padding: '12px', minHeight: '100px', cursor: isCurrentMonth ? 'pointer' : 'default', borderTop: isCurrentMonth ? '3px solid #FFD700' : '3px solid transparent' }}
                      onMouseEnter={e => isCurrentMonth && (e.currentTarget.style.backgroundColor = '#f0f8ff')}
                      onMouseLeave={e => isCurrentMonth && (e.currentTarget.style.backgroundColor = 'white')}
                    >
                      <div style={{ fontWeight: 'bold', color: '#003366', marginBottom: '8px', fontSize: '14px' }}>{day}</div>
                      {eventsOnDate.slice(0, 2).map((ev, i) => {
                        const cat = eventCategories.find(c => c.name === ev.category);
                        const bg = cat ? cat.color : '#FFD700';
                        return (
                          <div key={i} style={{ backgroundColor: bg, color: bg === '#FFD700' ? '#003366' : 'white', padding: '4px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                        );
                      })}
                      {eventsOnDate.length > 2 && <div style={{ color: '#999', fontSize: '9px' }}>+{eventsOnDate.length - 2} more</div>}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Event Modal */}
            {showCalendarEventModal && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '500px', width: '90%' }}>
                  <h3 style={{ color: '#003366', marginTop: 0 }}>Add Event — {selectedCalendarDate?.toLocaleDateString()}</h3>
                  <input type="text" placeholder="Event Title" value={eventFormData.title} onChange={e => setEventFormData({...eventFormData, title: e.target.value})} style={{ ...inputStyle, marginBottom: '15px' }} />
                  <textarea placeholder="Description" value={eventFormData.description} onChange={e => setEventFormData({...eventFormData, description: e.target.value})} style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit', marginBottom: '15px' }} />
                  <select value={eventFormData.category} onChange={e => setEventFormData({...eventFormData, category: e.target.value})} style={{ ...inputStyle, marginBottom: '20px' }}>
                    <option value="">Select Category</option>
                    {eventCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowCalendarEventModal(false)} style={{ padding: '10px 20px', backgroundColor: '#ddd', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                    <button onClick={async () => {
                      if (!eventFormData.title) { alert('제목을 입력하세요'); return; }
                      const { error } = await supabase.from('calendar_events').insert([{ title: eventFormData.title, description: eventFormData.description, start_date: selectedCalendarDate.toISOString().split('T')[0], end_date: selectedCalendarDate.toISOString().split('T')[0], category: eventFormData.category }]);
                      if (error) { alert('Error: ' + error.message); return; }
                      fetchCalendarEvents();
                      setShowCalendarEventModal(false);
                      setEventFormData({ title: '', description: '', start_date: '', end_date: '', category: 'Academic' });
                    }} style={{ padding: '10px 20px', backgroundColor: '#FFD700', color: '#003366', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Add Event</button>
                  </div>
                </div>
              </div>
            )}

            {/* Category Management */}
            {showCategoryManagement && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
                  <h3 style={{ color: '#003366', marginTop: 0 }}>Manage Event Categories</h3>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" placeholder="Category Name" value={newCategoryData.name} onChange={e => setNewCategoryData({...newCategoryData, name: e.target.value})} style={{ flex: 1, ...inputStyle }} />
                      <input type="color" value={newCategoryData.color} onChange={e => setNewCategoryData({...newCategoryData, color: e.target.value})} style={{ width: '50px', height: '40px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }} />
                      <button onClick={addEventCategory} style={{ padding: '10px 20px', backgroundColor: '#FFD700', color: '#003366', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Add</button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                    {eventCategories.map(cat => (
                      <div key={cat.id} style={{ padding: '15px', border: '2px solid #ddd', borderRadius: '4px', backgroundColor: cat.color, color: cat.color === '#FFD700' ? '#003366' : 'white', textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{cat.name}</div>
                        <button onClick={() => deleteEventCategory(cat.id)} style={{ padding: '4px 10px', backgroundColor: 'rgba(255,77,77,0.8)', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>Delete</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <button onClick={() => setShowCategoryManagement(false)} style={{ padding: '10px 20px', backgroundColor: '#ddd', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CERTIFICATES ── */}
        {activeSection === 'certificates' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#003366', marginBottom: '20px' }}>Certificate Issuance</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#003366' }}>Select Student:</label>
              <select value={selectedStudentForCert?.id || ''} onChange={e => setSelectedStudentForCert(students.find(s => s.id == e.target.value))} style={{ ...inputStyle }}>
                <option value="">— Select a student —</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} (ID: {s.student_id})</option>)}
              </select>
            </div>
            {selectedStudentForCert && (
              <>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#003366' }}>Certificate Type:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { type: 'admission', label: '📋 Admission Certificate' },
                    { type: 'enrollment', label: '📚 Enrollment Certificate' },
                    { type: 'graduation', label: '🎓 Graduation Certificate' },
                    { type: 'transcript', label: '📊 Academic Transcript' },
                    { type: 'tuition', label: '💳 Tuition Payment Receipt' }
                  ].map(c => (
                    <button key={c.type} onClick={() => setCertificateType(c.type)} style={{ padding: '15px', backgroundColor: certificateType === c.type ? '#003366' : '#f5f5f5', color: certificateType === c.type ? 'white' : '#003366', border: '2px solid #003366', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>{c.label}</button>
                  ))}
                </div>
                {certificateType && (
                  <div style={{ border: '3px solid #003366', padding: '40px', marginBottom: '20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #FFD700' }}>
                      <div style={{ fontSize: '11px', color: '#003366', fontStyle: 'italic', marginBottom: '8px', fontWeight: 'bold' }}>OFFICIAL CERTIFICATE</div>
                      <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#003366', marginBottom: '5px' }}>Myanmar Christianity School</div>
                      <div style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>With Truth and Loyalty</div>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#003366', textDecoration: 'underline' }}>
                        {certificateType === 'admission' && 'ADMISSION CERTIFICATE'}
                        {certificateType === 'enrollment' && 'ENROLLMENT CERTIFICATE'}
                        {certificateType === 'graduation' && 'GRADUATION CERTIFICATE'}
                        {certificateType === 'transcript' && 'ACADEMIC TRANSCRIPT'}
                        {certificateType === 'tuition' && 'TUITION PAYMENT RECEIPT'}
                      </div>
                    </div>
                    <p style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '13px' }}>This is to certify that</p>
                    <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#003366', margin: '0 0 5px 0' }}>{selectedStudentForCert.first_name} {selectedStudentForCert.last_name}</p>
                    {selectedStudentForCert.father_name && <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', margin: '0 0 15px 0' }}>Son/Daughter of {selectedStudentForCert.father_name}</p>}
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderLeft: '4px solid #FFD700', fontSize: '12px', lineHeight: '1.6' }}>
                      {certificateType === 'admission' && 'has been admitted to Myanmar Christianity School for the current academic year.'}
                      {certificateType === 'enrollment' && `is currently enrolled as a student in good standing, pursuing studies in ${selectedStudentForCert.specialization || 'General Studies'}.`}
                      {certificateType === 'graduation' && `has successfully completed all academic requirements and is hereby certified as a graduate of Myanmar Christianity School.`}
                      {certificateType === 'transcript' && 'Academic performance records are maintained in our official records.'}
                      {certificateType === 'tuition' && 'has fulfilled all tuition payment obligations for the current academic period.'}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '40px', textAlign: 'center' }}>
                      <div><div style={{ height: '50px' }} /><div style={{ borderTop: '2px solid #003366', paddingTop: '8px', fontSize: '11px', fontWeight: 'bold', color: '#003366' }}>Principal Signature</div></div>
                      <div><div style={{ height: '50px' }} /><div style={{ borderTop: '2px solid #003366', paddingTop: '8px', fontSize: '11px', fontWeight: 'bold', color: '#003366' }}>Date: {new Date().toLocaleDateString()}</div></div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '10px', color: '#999', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                      Certificate ID: {selectedStudentForCert.student_id}-{certificateType.toUpperCase()}-{new Date().getFullYear()}
                    </div>
                  </div>
                )}
                {certificateType && (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => window.print()} style={{ padding: '10px 20px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>🖨️ Print Certificate</button>
                    <button onClick={() => { setCertificateType(null); setSelectedStudentForCert(null); }} style={{ padding: '10px 20px', backgroundColor: '#ddd', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reset</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── ABOUT ── */}
        {activeSection === 'about' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#003366', marginBottom: '20px' }}>About MCS Academy</h2>
            <p style={{ lineHeight: '1.6', color: '#666', marginBottom: '15px' }}>Myanmar Christianity School (MCS Academy) is a comprehensive educational institution serving students from kindergarten through high school. Our mission is to provide quality education rooted in Christian values and truth.</p>
            <p style={{ lineHeight: '1.6', color: '#666' }}>This Student Information System helps us manage and track student records, faculty information, and staff records efficiently. With Truth and Loyalty.</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#003366', color: 'white', padding: '40px 20px', marginTop: '40px', textAlign: 'center', fontSize: '12px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p>&copy; 2026 Myanmar Christianity School. All rights reserved.</p>
          <p style={{ marginTop: '10px', color: '#ccc' }}>Student Information System | With Truth and Loyalty</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div style={{ backgroundColor: '#003366', color: 'white', padding: '30px', borderRadius: '4px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
      <h3 style={{ margin: '0', fontSize: '36px', fontWeight: 'bold', color: '#FFD700' }}>{value}</h3>
    </div>
  );
}

function InfoBox({ title, value, color }) {
  return (
    <div style={{ backgroundColor: 'white', border: `3px solid ${color}`, padding: '20px', borderRadius: '4px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>{title}</p>
      <h3 style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color }}>{value}</h3>
    </div>
  );
}

function FacultyCard({ member, onDelete }) {
  return (
    <div style={{ backgroundColor: 'white', border: '2px solid #003366', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ width: '100%', height: '200px', backgroundColor: '#e0e0e0', backgroundImage: member.photo_url ? `url(${member.photo_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#999' }}>
        {!member.photo_url && '📷'}
      </div>
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 5px 0', color: '#003366', fontSize: '18px', fontWeight: 'bold' }}>{member.first_name} {member.last_name}</h3>
        <p style={{ margin: '0 0 10px 0', color: '#FFD700', fontSize: '12px', fontWeight: 'bold' }}>{member.role}</p>
        {member.subjects && <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>📚 {member.subjects}</p>}
        {member.classes && <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>🏫 {member.classes}</p>}
        {member.contact_email && <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#999' }}>✉️ {member.contact_email}</p>}
        {member.contact_phone && <p style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#999' }}>📞 {member.contact_phone}</p>}
        <button onClick={onDelete} style={{ width: '100%', padding: '8px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
      </div>
    </div>
  );
}
