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
    }
  }, [user]);

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
              <h2 style={{ fontSize: '36px', margin: '0 0 10px 0', fontWeight: 'bold' }}>Student Information System</h2>
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
