"use client";

import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle, Globe, Plus, Trash2, Edit2, Search, Menu, X } from 'lucide-react';
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      {/* HEADER - Logo and Title */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
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
      </div>

      {/* NAVIGATION BAR */}
      <div style={{
        backgroundColor: '#003366',
        borderBottom: '3px solid #FFD700',
        padding: '0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '24px'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          <div style={{ display: 'flex', width: '100%' }}>
            {['HOME', 'ABOUT', 'DEPARTMENTS', 'ADMISSION', 'RECORDS', 'RESEARCH', 'INTERNATIONAL', 'MEDIA'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '15px 16px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  borderBottom: '3px solid transparent',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  display: 'block'
                }}
                onMouseEnter={(e) => e.target.style.borderBottomColor = '#FFD700'}
                onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
              >
                {item}
              </a>
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

        {/* HERO SECTION with Background Image */}
        <div style={{
          backgroundColor: '#003366',
          color: 'white',
          padding: '60px 40px',
          borderRadius: '4px',
          marginBottom: '40px',
          backgroundImage: 'linear-gradient(135deg, #003366 0%, #0055A4 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '36px', margin: '0 0 10px 0', fontWeight: 'bold' }}>Student Information System</h2>
            <p style={{ fontSize: '16px', margin: '0', color: '#e0e0e0' }}>Myanmar Christianity School - Official Student Records Management</p>
          </div>
        </div>

        {/* THREE CARD SECTION - Like University of Yangon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <InfoCard 
            icon="👥"
            title="Total Students"
            value={stats.totalStudents}
            description="Students enrolled in the system"
          />
          <InfoCard 
            icon="📊"
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            description="Average attendance across all grades"
          />
          <InfoCard 
            icon="✓"
            title="Baptized Students"
            value={stats.baptizedStudents}
            description={`${stats.totalStudents > 0 ? Math.round((stats.baptizedStudents / stats.totalStudents) * 100) : 0}% of total`}
          />
        </div>

        {/* ADD STUDENT FORM */}
        {showAddForm && (
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
              <select
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: parseInt(e.target.value)})}
                style={{ padding: '10px', border: '1px solid #003366', borderRadius: '4px', fontSize: '14px' }}
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

        {/* STUDENT RECORDS TABLE */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Table Header */}
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
              <p style={{ margin: '0', fontSize: '12px', color: '#ccc' }}>{students.length} students in the system</p>
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

          {/* Table Body */}
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</div>
          ) : students.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              <p>No students found. Add your first student to get started.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #003366' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Student ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Grade</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Ethnicity</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Attendance</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Baptized</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#003366', fontSize: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.id} style={{
                    borderBottom: '1px solid #eee',
                    backgroundColor: idx % 2 === 0 ? 'white' : '#f9f9f9'
                  }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold', color: '#003366' }}>{student.student_id}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{student.first_name} {student.last_name}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>Grade {student.grade}</td>
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
          <p>&copy; 2024 Myanmar Christianity School. All rights reserved.</p>
          <p style={{ marginTop: '10px', color: '#ccc' }}>Student Information System | With Truth and Loyalty</p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

function InfoCard({ icon, title, value, description }) {
  return (
    <div style={{
      backgroundColor: '#003366',
      color: 'white',
      padding: '30px',
      borderRadius: '4px',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        fontSize: '80px',
        opacity: '0.1'
      }}>
        {icon}
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
        <h3 style={{ margin: '0', fontSize: '36px', fontWeight: 'bold', color: '#FFD700' }}>{value}</h3>
        <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#bbb' }}>{description}</p>
      </div>
    </div>
  );
}
