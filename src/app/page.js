"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Calendar, CheckCircle, Globe, Plus, Trash2, Edit2, Search, Menu, X, Briefcase, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function MyanmarSIS() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('records');
  const [staffFilter, setStaffFilter] = useState('all'); // 'all', 'faculty', 'staff'
  
  // Authentication states
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Data states
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Filter states
  const [ageFilter, setAgeFilter] = useState('all');
  
  // Calendar states
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [showCalendarEventModal, setShowCalendarEventModal] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    category: 'Academic'
  });
  
  // Certificate states
  const [selectedStudentForCert, setSelectedStudentForCert] = useState(null);
  const [certificateType, setCertificateType] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalStaff: 0,
    attendanceRate: 0,
    baptizedStudents: 0,
    kindergarten: 0,
    elementary: 0,
    middle: 0,
    high: 0
  });
  
  // Form data
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    age: '',
    grade: 1,
    gender: 'Male',
    ethnicity: '',
    is_baptized: false,
    attendance_rate: 85
  });

  const [staffFormData, setStaffFormData] = useState({
    staff_id: '',
    first_name: '',
    last_name: '',
    is_faculty: true, // true: 교원, false: 직원
    role: 'Teacher',
    department: '',
    subjects: '', // 교원용
    classes: '', // 교원용
    job_title: '', // 직원용
    contact_email: '',
    contact_phone: '',
    photo_url: ''
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
        } else {
          setUser(session.user);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/login');
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (user) {
      fetchData();
      fetchCalendarEvents();
    }
  }, [user]);
  
  const fetchCalendarEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      setCalendarEvents(data || []);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('student_id', { ascending: true });

      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .order('staff_id', { ascending: true });

      if (studentsError) throw studentsError;
      if (staffError) throw staffError;

      setStudents(studentsData || []);
      setStaff(staffData || []);
      calculateStats(studentsData || [], staffData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (studentList, staffList) => {
    const totalStudents = studentList.length;
    const totalFaculty = staffList.filter(s => s.is_faculty).length;
    const totalStaffCount = staffList.filter(s => !s.is_faculty).length;
    const baptizedStudents = studentList.filter(s => s.is_baptized).length;
    const avgAttendance = studentList.length > 0 
      ? (studentList.reduce((sum, s) => sum + (s.attendance_rate || 0), 0) / studentList.length).toFixed(0)
      : 0;

    const kindergarten = studentList.filter(s => s.age && s.age >= 3 && s.age <= 5).length;
    const elementary = studentList.filter(s => s.age && s.age >= 6 && s.age <= 11).length;
    const middle = studentList.filter(s => s.age && s.age >= 12 && s.age <= 14).length;
    const high = studentList.filter(s => s.age && s.age >= 15 && s.age <= 18).length;

    setStats({
      totalStudents,
      totalFaculty,
      totalStaff: totalStaffCount,
      attendanceRate: avgAttendance,
      baptizedStudents,
      kindergarten,
      elementary,
      middle,
      high
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
      calculateStats([...students, ...data], staff);
      setFormData({
        student_id: '',
        first_name: '',
        last_name: '',
        age: '',
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

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const { data, error: insertError } = await supabase
        .from('staff')
        .insert([staffFormData])
        .select();

      if (insertError) throw insertError;

      setStaff([...staff, ...data]);
      calculateStats(students, [...staff, ...data]);
      setStaffFormData({
        staff_id: '',
        first_name: '',
        last_name: '',
        is_faculty: true,
        role: 'Teacher',
        department: '',
        subjects: '',
        classes: '',
        job_title: '',
        contact_email: '',
        contact_phone: '',
        photo_url: ''
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding staff:', err);
      setError(err.message || 'Failed to add staff');
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

      const updated = students.filter(s => s.id !== id);
      setStudents(updated);
      calculateStats(updated, staff);
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(err.message || 'Failed to delete student');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      const updated = staff.filter(s => s.id !== id);
      setStaff(updated);
      calculateStats(students, updated);
    } catch (err) {
      console.error('Error deleting staff:', err);
      setError(err.message || 'Failed to delete staff');
    }
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
    if (ageFilter === 'kindergarten') return students.filter(s => s.age && s.age >= 3 && s.age <= 5);
    if (ageFilter === 'elementary') return students.filter(s => s.age && s.age >= 6 && s.age <= 11);
    if (ageFilter === 'middle') return students.filter(s => s.age && s.age >= 12 && s.age <= 14);
    if (ageFilter === 'high') return students.filter(s => s.age && s.age >= 15 && s.age <= 18);
    return students;
  };

  const getFilteredStaff = () => {
    if (staffFilter === 'all') return staff;
    if (staffFilter === 'faculty') return staff.filter(s => s.is_faculty);
    if (staffFilter === 'staff') return staff.filter(s => !s.is_faculty);
    return staff;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout. Please try again.');
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect to login)
  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      {/* HEADER */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#003366',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              M
            </div>
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
            <button
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ff5252'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '9999'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px',
            maxWidth: '400px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#003366', fontSize: '18px' }}>Confirm Logout</h3>
            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '14px' }}>Are you sure you want to logout?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ddd',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION BAR */}
      <div style={{
        backgroundColor: '#003366',
        borderBottom: '3px solid #FFD700',
        padding: '0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            {[
              { label: 'HOME', section: 'home' },
              { label: 'STUDENT RECORDS', section: 'records' },
              { label: 'FACULTY', section: 'faculty' },
              { label: 'STAFF', section: 'staff' },
              { label: 'CALENDAR', section: 'calendar' },
              { label: 'CERTIFICATES', section: 'certificates' },
              { label: 'ABOUT', section: 'about' }
            ].map((item) => (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                style={{
                  color: activeSection === item.section ? '#FFD700' : 'white',
                  textDecoration: 'none',
                  padding: '15px 16px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  borderBottom: activeSection === item.section ? '3px solid #FFD700' : '3px solid transparent',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '2px solid #f00',
            color: '#c00',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* HOME SECTION */}
        {activeSection === 'home' && (
          <>
            <div style={{
              backgroundColor: '#003366',
              color: 'white',
              padding: '60px 40px',
              borderRadius: '4px',
              marginBottom: '40px',
              backgroundImage: 'linear-gradient(135deg, #003366 0%, #0055A4 100%)'
            }}>
              <h2 style={{ fontSize: '36px', margin: '0 0 10px 0', fontWeight: 'bold' }}>Member Information System</h2>
              <p style={{ fontSize: '16px', margin: '0', color: '#e0e0e0' }}>Myanmar Christianity School - Official Student & Staff Records Management</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              <StatCard title="Total Students" value={stats.totalStudents} icon="👥" />
              <StatCard title="Faculty Members" value={stats.totalFaculty} icon="👨‍🏫" />
              <StatCard title="Staff Members" value={stats.totalStaff} icon="👔" />
              <StatCard title="Avg Attendance" value={`${stats.attendanceRate}%`} icon="📊" />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <InfoBox title="Kindergarten" value={stats.kindergarten} color="#FF6B6B" />
              <InfoBox title="Elementary" value={stats.elementary} color="#4ECDC4" />
              <InfoBox title="Middle School" value={stats.middle} color="#45B7D1" />
              <InfoBox title="High School" value={stats.high} color="#96CEB4" />
            </div>
          </>
        )}

        {/* STUDENT RECORDS SECTION */}
        {activeSection === 'records' && (
          <>
            <div style={{
              backgroundColor: '#e8f4f8',
              border: '2px solid #003366',
              padding: '20px',
              borderRadius: '4px',
              marginBottom: '30px'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#003366' }}>Filter by Age Group</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Kindergarten (3-5)', value: 'kindergarten' },
                  { label: 'Elementary (6-11)', value: 'elementary' },
                  { label: 'Middle School (12-14)', value: 'middle' },
                  { label: 'High School (15-18)', value: 'high' }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setAgeFilter(filter.value)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: ageFilter === filter.value ? '#003366' : 'white',
                      color: ageFilter === filter.value ? 'white' : '#003366',
                      border: '2px solid #003366',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s'
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {showAddForm && activeSection === 'records' && (
              <div style={{
                backgroundColor: '#e8f4f8',
                border: '2px solid #003366',
                padding: '20px',
                borderRadius: '4px',
                marginBottom: '30px'
              }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#003366' }}>Add New Student</h3>
                <form onSubmit={handleAddStudent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <input
                    type="text"
                    placeholder="Student ID"
                    value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                    required
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value ? parseInt(e.target.value) : ''})}
                    min="3"
                    max="100"
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Ethnicity"
                    value={formData.ethnicity}
                    onChange={(e) => setFormData({...formData, ethnicity: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="number"
                    placeholder="Attendance Rate (%)"
                    value={formData.attendance_rate}
                    onChange={(e) => setFormData({...formData, attendance_rate: parseFloat(e.target.value)})}
                    min="0"
                    max="100"
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Father's Name"
                    value={formData.father_name || ''}
                    onChange={(e) => setFormData({...formData, father_name: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Roll Number"
                    value={formData.roll_no || ''}
                    onChange={(e) => setFormData({...formData, roll_no: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Registration Number"
                    value={formData.reg_no || ''}
                    onChange={(e) => setFormData({...formData, reg_no: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="National Registration No (NRC)"
                    value={formData.nrc_no || ''}
                    onChange={(e) => setFormData({...formData, nrc_no: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Regional Centre"
                    value={formData.regional_centre || ''}
                    onChange={(e) => setFormData({...formData, regional_centre: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Specialization"
                    value={formData.specialization || ''}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_baptized}
                      onChange={(e) => setFormData({...formData, is_baptized: e.target.checked})}
                    />
                    Baptized
                  </label>
                  <button
                    type="submit"
                    style={{
                      gridColumn: 'span 2',
                      padding: '12px 20px',
                      backgroundColor: '#FFD700',
                      color: '#003366',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Save Student
                  </button>
                </form>
              </div>
            )}

            <div style={{
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                backgroundColor: '#003366',
                color: 'white',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Student Records</h3>
                  <p style={{ margin: '0', fontSize: '12px', color: '#ccc' }}>{getFilteredStudents().length} students</p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#FFD700',
                    color: '#003366',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  + Add Student
                </button>
              </div>

              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</div>
              ) : getFilteredStudents().length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  <p>No students found in this age group.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #003366' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Student ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Age</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Category</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Ethnicity</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Attendance</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Baptized</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredStudents().map((student, idx) => (
                      <tr key={student.id} style={{
                        borderBottom: '1px solid #eee',
                        backgroundColor: idx % 2 === 0 ? 'white' : '#f9f9f9'
                      }}>
                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold', color: '#003366' }}>{student.student_id}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{student.first_name} {student.last_name}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{student.age || '-'}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{getAgeCategory(student.age)}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>{student.ethnicity || '-'}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '60px', height: '6px', backgroundColor: '#ddd', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${student.attendance_rate}%`,
                                height: '100%',
                                backgroundColor: '#4CAF50'
                              }}></div>
                            </div>
                            <span>{student.attendance_rate}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '3px',
                            backgroundColor: student.is_baptized ? '#c8e6c9' : '#f5f5f5',
                            color: student.is_baptized ? '#2e7d32' : '#999',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {student.is_baptized ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: '#ff6b6b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
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

        {/* FACULTY SECTION */}
        {activeSection === 'faculty' && (
          <>
            {showAddForm && (
              <div style={{
                backgroundColor: '#e8f4f8',
                border: '2px solid #003366',
                padding: '20px',
                borderRadius: '4px',
                marginBottom: '30px'
              }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#003366' }}>Add New Faculty Member</h3>
                <form onSubmit={handleAddStaff} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <input
                    type="text"
                    placeholder="Staff ID"
                    value={staffFormData.staff_id}
                    onChange={(e) => setStaffFormData({...staffFormData, staff_id: e.target.value})}
                    required
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={staffFormData.first_name}
                    onChange={(e) => setStaffFormData({...staffFormData, first_name: e.target.value})}
                    required
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={staffFormData.last_name}
                    onChange={(e) => setStaffFormData({...staffFormData, last_name: e.target.value})}
                    required
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Subjects (e.g., Math, Science)"
                    value={staffFormData.subjects}
                    onChange={(e) => setStaffFormData({...staffFormData, subjects: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Classes (e.g., Grade 10-A, 11-B)"
                    value={staffFormData.classes}
                    onChange={(e) => setStaffFormData({...staffFormData, classes: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    value={staffFormData.department}
                    onChange={(e) => setStaffFormData({...staffFormData, department: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={staffFormData.contact_email}
                    onChange={(e) => setStaffFormData({...staffFormData, contact_email: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={staffFormData.contact_phone}
                    onChange={(e) => setStaffFormData({...staffFormData, contact_phone: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Photo URL (paste image link)"
                    value={staffFormData.photo_url}
                    onChange={(e) => setStaffFormData({...staffFormData, photo_url: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <button
                    type="submit"
                    style={{
                      gridColumn: 'span 2',
                      padding: '12px 20px',
                      backgroundColor: '#FFD700',
                      color: '#003366',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Save Faculty Member
                  </button>
                </form>
              </div>
            )}

            <div style={{
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              marginBottom: '30px'
            }}>
              <div style={{
                backgroundColor: '#003366',
                color: 'white',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Faculty Directory</h3>
                  <p style={{ margin: '0', fontSize: '12px', color: '#ccc' }}>{staff.filter(s => s.is_faculty).length} faculty members</p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#FFD700',
                    color: '#003366',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  + Add Faculty
                </button>
              </div>

              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</div>
              ) : staff.filter(s => s.is_faculty).length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  <p>No faculty members found.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
                  {staff.filter(s => s.is_faculty).map((member) => (
                    <FacultyCard key={member.id} member={member} onDelete={() => handleDeleteStaff(member.id)} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* STAFF SECTION */}
        {activeSection === 'staff' && (
          <>
            {showAddForm && (
              <div style={{
                backgroundColor: '#e8f4f8',
                border: '2px solid #003366',
                padding: '20px',
                borderRadius: '4px',
                marginBottom: '30px'
              }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#003366' }}>Add New Staff Member</h3>
                <form onSubmit={handleAddStaff} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <input
                    type="text"
                    placeholder="Staff ID"
                    value={staffFormData.staff_id}
                    onChange={(e) => setStaffFormData({...staffFormData, staff_id: e.target.value})}
                    required
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={staffFormData.first_name}
                    onChange={(e) => setStaffFormData({...staffFormData, first_name: e.target.value})}
                    required
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={staffFormData.last_name}
                    onChange={(e) => setStaffFormData({...staffFormData, last_name: e.target.value})}
                    required
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Job Title (e.g., Accountant, Janitor)"
                    value={staffFormData.job_title}
                    onChange={(e) => setStaffFormData({...staffFormData, job_title: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    value={staffFormData.department}
                    onChange={(e) => setStaffFormData({...staffFormData, department: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={staffFormData.contact_email}
                    onChange={(e) => setStaffFormData({...staffFormData, contact_email: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={staffFormData.contact_phone}
                    onChange={(e) => setStaffFormData({...staffFormData, contact_phone: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
                  />
                  <button
                    type="submit"
                    style={{
                      gridColumn: 'span 2',
                      padding: '12px 20px',
                      backgroundColor: '#FFD700',
                      color: '#003366',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Save Staff Member
                  </button>
                </form>
              </div>
            )}

            <div style={{
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                backgroundColor: '#003366',
                color: 'white',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Staff Directory</h3>
                  <p style={{ margin: '0', fontSize: '12px', color: '#ccc' }}>{staff.filter(s => !s.is_faculty).length} staff members</p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#FFD700',
                    color: '#003366',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  + Add Staff
                </button>
              </div>

              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</div>
              ) : staff.filter(s => !s.is_faculty).length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  <p>No staff members found.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #003366' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Staff ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Job Title</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Department</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.filter(s => !s.is_faculty).map((member, idx) => (
                      <tr key={member.id} style={{
                        borderBottom: '1px solid #eee',
                        backgroundColor: idx % 2 === 0 ? 'white' : '#f9f9f9'
                      }}>
                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold', color: '#003366' }}>{member.staff_id}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{member.first_name} {member.last_name}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{member.job_title || '-'}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>{member.department || '-'}</td>
                        <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>{member.contact_email || '-'}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDeleteStaff(member.id)}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: '#ff6b6b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
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

        {/* ABOUT SECTION */}
        {activeSection === 'calendar' && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {/* Calendar Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '2px solid #FFD700'
            }}>
              <button
                onClick={() => {
                  const newDate = new Date(calendarMonth);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCalendarMonth(newDate);
                }}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#003366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ← Previous
              </button>
              
              <h2 style={{ color: '#003366', margin: '0', fontSize: '24px' }}>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
              </h2>
              
              <button
                onClick={() => {
                  const newDate = new Date(calendarMonth);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCalendarMonth(newDate);
                }}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#003366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Next →
              </button>
            </div>
            
            {/* Day Names */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '1px',
              backgroundColor: '#ddd',
              marginBottom: '1px'
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  style={{
                    backgroundColor: '#003366',
                    color: 'white',
                    padding: '12px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '1px',
              backgroundColor: '#ddd'
            }}>
              {(() => {
                const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
                const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
                const days = [];
                
                for (let i = 0; i < firstDay; i++) days.push(null);
                for (let i = 1; i <= daysInMonth; i++) days.push(i);
                
                return days.map((day, index) => {
                  const isCurrentMonth = day !== null;
                  const dateObj = isCurrentMonth ? new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day) : null;
                  const eventsOnDate = isCurrentMonth ? calendarEvents.filter(event => {
                    const eventDate = new Date(event.start_date);
                    return eventDate.toDateString() === dateObj.toDateString();
                  }) : [];
                  
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (isCurrentMonth) {
                          setSelectedCalendarDate(dateObj);
                          setShowCalendarEventModal(true);
                        }
                      }}
                      style={{
                        backgroundColor: isCurrentMonth ? 'white' : '#f5f5f5',
                        padding: '12px',
                        minHeight: '100px',
                        border: '1px solid #ddd',
                        cursor: isCurrentMonth ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        borderTop: isCurrentMonth ? '3px solid #FFD700' : '3px solid transparent',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => isCurrentMonth && (e.currentTarget.style.backgroundColor = '#f0f8ff')}
                      onMouseLeave={(e) => isCurrentMonth && (e.currentTarget.style.backgroundColor = 'white')}
                    >
                      <div style={{
                        fontWeight: 'bold',
                        color: '#003366',
                        marginBottom: '8px',
                        fontSize: '14px'
                      }}>
                        {day}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {eventsOnDate.slice(0, 2).map((event, idx) => (
                          <div
                            key={idx}
                            style={{
                              backgroundColor: '#FFD700',
                              color: '#003366',
                              padding: '4px 6px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {eventsOnDate.length > 2 && (
                          <div style={{
                            color: '#999',
                            fontSize: '9px',
                            fontStyle: 'italic'
                          }}>
                            +{eventsOnDate.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
            
            {/* Event Modal */}
            {showCalendarEventModal && (
              <div style={{
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '1000'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  maxWidth: '500px',
                  width: '90%'
                }}>
                  <h3 style={{ color: '#003366', marginTop: '0' }}>
                    Add Event - {selectedCalendarDate?.toLocaleDateString()}
                  </h3>
                  
                  <input
                    type="text"
                    placeholder="Event Title"
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '15px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box',
                      fontSize: '14px'
                    }}
                  />
                  
                  <textarea
                    placeholder="Description (optional)"
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '15px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box',
                      fontSize: '14px',
                      minHeight: '80px',
                      fontFamily: 'inherit'
                    }}
                  />
                  
                  <select
                    value={eventFormData.category}
                    onChange={(e) => setEventFormData({...eventFormData, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '20px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Academic">Academic</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Exam">Exam</option>
                    <option value="Event">Event</option>
                    <option value="Other">Other</option>
                  </select>
                  
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setShowCalendarEventModal(false)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#ddd',
                        color: '#333',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (!eventFormData.title) {
                          alert('Please enter event title');
                          return;
                        }
                        const eventData = {
                          title: eventFormData.title,
                          description: eventFormData.description,
                          start_date: selectedCalendarDate.toISOString().split('T')[0],
                          end_date: selectedCalendarDate.toISOString().split('T')[0],
                          category: eventFormData.category
                        };
                        const { error } = await supabase.from('calendar_events').insert([eventData]);
                        if (error) {
                          alert('Error adding event: ' + error.message);
                        } else {
                          fetchCalendarEvents();
                          setShowCalendarEventModal(false);
                          setEventFormData({ title: '', description: '', start_date: '', end_date: '', category: 'Academic' });
                        }
                      }}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#FFD700',
                        color: '#003366',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Add Event
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'certificates' && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#003366', marginBottom: '20px' }}>Certificate Issuance</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#003366' }}>Select Student:</label>
              <select
                value={selectedStudentForCert?.id || ''}
                onChange={(e) => {
                  const student = students.find(s => s.id == e.target.value);
                  setSelectedStudentForCert(student);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">-- Select a student --</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} (ID: {student.student_id})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedStudentForCert && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#003366' }}>Select Certificate Type:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { type: 'admission', label: '📋 Admission Certificate' },
                    { type: 'enrollment', label: '📚 Enrollment Certificate' },
                    { type: 'graduation', label: '🎓 Graduation Certificate' },
                    { type: 'transcript', label: '📊 Academic Transcript' },
                    { type: 'tuition', label: '💳 Tuition Payment Receipt' }
                  ].map(cert => (
                    <button
                      key={cert.type}
                      onClick={() => setCertificateType(cert.type)}
                      style={{
                        padding: '15px',
                        backgroundColor: certificateType === cert.type ? '#003366' : '#f5f5f5',
                        color: certificateType === cert.type ? 'white' : '#003366',
                        border: '2px solid #003366',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        transition: 'all 0.3s'
                      }}
                    >
                      {cert.label}
                    </button>
                  ))}
                </div>
                
{certificateType && (
                  <div style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    marginBottom: '20px',
                    border: '3px solid #003366',
                    borderRadius: '0px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    position: 'relative',
                    background: 'linear-gradient(to right, rgba(0,51,102,0.02) 0%, transparent 50%, rgba(0,51,102,0.02) 100%)'
                  }}>
                    <div style={{ position: 'relative', zIndex: '1' }}>
                      {/* Header */}
                      <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #FFD700' }}>
                        <div style={{ fontSize: '11px', color: '#003366', fontStyle: 'italic', marginBottom: '8px', fontWeight: 'bold' }}>OFFICIAL CERTIFICATE</div>
                        <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#003366', marginBottom: '5px' }}>Myanmar Christianity School</div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '3px' }}>MCS Academy</div>
                        <div style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>With Truth and Loyalty</div>
                      </div>
                      
                      {/* Certificate Type */}
                      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#003366', textDecoration: 'underline', textDecorationThickness: '2px', textUnderlineOffset: '5px' }}>
                          {certificateType === 'admission' && 'ADMISSION CERTIFICATE'}
                          {certificateType === 'enrollment' && 'ENROLLMENT CERTIFICATE'}
                          {certificateType === 'graduation' && 'GRADUATION CERTIFICATE'}
                          {certificateType === 'transcript' && 'ACADEMIC TRANSCRIPT'}
                          {certificateType === 'tuition' && 'TUITION PAYMENT RECEIPT'}
                        </div>
                      </div>
                      
                      {/* Main Content */}
                      <div style={{ marginBottom: '25px', lineHeight: '1.8', color: '#333', fontSize: '13px' }}>
                        <p style={{ margin: '0 0 15px 0', textAlign: 'center' }}>This is to certify that</p>
                        <p style={{ margin: '0 0 15px 0', textAlign: 'center', fontSize: '15px', fontWeight: 'bold', color: '#003366' }}>
                          {selectedStudentForCert.first_name} {selectedStudentForCert.last_name}
                        </p>
                        {selectedStudentForCert.father_name && (
                          <p style={{ margin: '0 0 15px 0', textAlign: 'center', fontSize: '12px', color: '#666' }}>
                            Son/Daughter of {selectedStudentForCert.father_name}
                          </p>
                        )}
                        <div style={{ margin: '15px 0', textAlign: 'center', fontSize: '12px', color: '#666' }}>
                          {selectedStudentForCert.roll_no && <p style={{ margin: '3px 0' }}>Roll No: {selectedStudentForCert.roll_no}</p>}
                          {selectedStudentForCert.reg_no && <p style={{ margin: '3px 0' }}>Registered No: {selectedStudentForCert.reg_no}</p>}
                          {selectedStudentForCert.nrc_no && <p style={{ margin: '3px 0' }}>National Registration No: {selectedStudentForCert.nrc_no}</p>}
                          {selectedStudentForCert.regional_centre && <p style={{ margin: '3px 0' }}>Regional Centre: {selectedStudentForCert.regional_centre}</p>}
                        </div>
                      </div>
                      
                      {/* Certificate Statement */}
                      <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f5f5f5', borderLeft: '4px solid #FFD700', fontSize: '12px', lineHeight: '1.6', color: '#333' }}>
                        {certificateType === 'admission' && <p style={{ margin: '0' }}>has been admitted to Myanmar Christianity School for the current academic year with all required documentation and qualifications.</p>}
                        {certificateType === 'enrollment' && <p style={{ margin: '0' }}>is currently enrolled as a student in good standing at Myanmar Christianity School and is pursuing studies in {selectedStudentForCert.specialization || 'General Studies'}.</p>}
                        {certificateType === 'graduation' && <p style={{ margin: '0' }}>has successfully completed all academic requirements and is hereby certified as a graduate of Myanmar Christianity School with distinction in {selectedStudentForCert.specialization || 'General Studies'}.</p>}
                        {certificateType === 'transcript' && <p style={{ margin: '0' }}>Academic performance records are maintained in our official records. This transcript certifies the student's academic standing and course completion status.</p>}
                        {certificateType === 'tuition' && <p style={{ margin: '0' }}>has fulfilled all tuition payment obligations for the current academic period and is in good financial standing.</p>}
                      </div>
                      
                      {/* Signature Section */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '40px', marginBottom: '20px', textAlign: 'center' }}>
                        <div>
                          <div style={{ height: '50px', marginBottom: '5px' }} />
                          <div style={{ borderTop: '2px solid #003366', paddingTop: '8px', fontSize: '11px', fontWeight: 'bold', color: '#003366' }}>Principal Signature</div>
                        </div>
                        <div>
                          <div style={{ height: '50px', marginBottom: '5px' }} />
                          <div style={{ borderTop: '2px solid #003366', paddingTop: '8px', fontSize: '11px', fontWeight: 'bold', color: '#003366' }}>Date: {new Date().toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      {/* Official Seal Area */}
                      <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #ccc' }}>
                        <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic', marginBottom: '8px' }}>[Official Seal/Stamp Area]</div>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          margin: '0 auto',
                          border: '3px solid #FFD700',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#FFD700',
                          backgroundColor: 'rgba(255, 215, 0, 0.05)'
                        }}>
                          ✓
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ddd', fontSize: '10px', color: '#999' }}>
                        <p style={{ margin: '0' }}>Authenticated and Certified by Myanmar Christianity School</p>
                        <p style={{ margin: '3px 0 0 0' }}>Certificate ID: {selectedStudentForCert.student_id}-{certificateType.toUpperCase()}-{new Date().getFullYear()}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {certificateType && (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                      onClick={() => window.print()}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#003366',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      🖨️ Print Certificate
                    </button>
                    <button
                      onClick={() => {
                        setCertificateType(null);
                        setSelectedStudentForCert(null);
                      }}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#ddd',
                        color: '#333',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeSection === 'about' && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#003366', marginBottom: '20px' }}>About MCS Academy</h2>
            <p style={{ lineHeight: '1.6', color: '#666', marginBottom: '15px' }}>
              Myanmar Christianity School (MCS Academy) is a comprehensive educational institution serving students from kindergarten through high school. Our mission is to provide quality education rooted in Christian values and truth.
            </p>
            <p style={{ lineHeight: '1.6', color: '#666' }}>
              This Student Information System helps us manage and track student records, faculty information, and staff records efficiently. With Truth and Loyalty.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: '#003366',
        color: 'white',
        padding: '40px 20px',
        marginTop: '40px',
        textAlign: 'center',
        fontSize: '12px'
      }}>
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
    <div style={{
      backgroundColor: '#003366',
      color: 'white',
      padding: '30px',
      borderRadius: '4px',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
      <h3 style={{ margin: '0', fontSize: '36px', fontWeight: 'bold', color: '#FFD700' }}>{value}</h3>
    </div>
  );
}

function InfoBox({ title, value, color }) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: `3px solid ${color}`,
      padding: '20px',
      borderRadius: '4px',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>{title}</p>
      <h3 style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color }}>{value}</h3>
    </div>
  );
}

function FacultyCard({ member, onDelete }) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: '2px solid #003366',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s',
      cursor: 'pointer'
    }}>
      {/* Photo */}
      <div style={{
        width: '100%',
        height: '200px',
        backgroundColor: '#e0e0e0',
        backgroundImage: member.photo_url ? `url(${member.photo_url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        color: '#999'
      }}>
        {!member.photo_url && '📷'}
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 5px 0', color: '#003366', fontSize: '18px', fontWeight: 'bold' }}>
          {member.first_name} {member.last_name}
        </h3>
        <p style={{ margin: '0 0 10px 0', color: '#FFD700', fontSize: '12px', fontWeight: 'bold' }}>
          {member.role}
        </p>

        {member.subjects && (
          <div style={{ marginBottom: '10px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Subjects:</p>
            <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>{member.subjects}</p>
          </div>
        )}

        {member.classes && (
          <div style={{ marginBottom: '10px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Classes:</p>
            <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>{member.classes}</p>
          </div>
        )}

        {member.contact_email && (
          <p style={{ margin: '10px 0 5px 0', color: '#999', fontSize: '11px' }}>✉️ {member.contact_email}</p>
        )}

        {member.contact_phone && (
          <p style={{ margin: '0 0 15px 0', color: '#999', fontSize: '11px' }}>📞 {member.contact_phone}</p>
        )}

        <button
          onClick={onDelete}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
