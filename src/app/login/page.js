"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate input
      if (!email || !password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      // Sign in with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        // Provide user-friendly error messages
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please confirm your email before logging in.');
        } else {
          setError(signInError.message || 'Login failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        // Successfully logged in
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Login Container */}
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#003366',
          backgroundImage: 'linear-gradient(135deg, #003366 0%, #0055A4 100%)',
          color: 'white',
          padding: '40px 30px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: 'bold',
            margin: '0 auto 20px',
            border: '3px solid #FFD700'
          }}>
            M
          </div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>MCS Academy</h1>
          <p style={{ margin: '0', fontSize: '14px', color: '#e0e0e0' }}>Administrator Portal</p>
        </div>

        {/* Form */}
        <div style={{ padding: '40px 30px' }}>
          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fee',
              border: '2px solid #f00',
              color: '#c00',
              padding: '12px 15px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email Input */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#003366',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mcs.edu.mm"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'Arial, sans-serif',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s',
                  backgroundColor: loading ? '#f5f5f5' : 'white',
                  cursor: loading ? 'not-allowed' : 'text'
                }}
                onFocus={(e) => e.target.style.borderColor = '#003366'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {/* Password Input */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#003366',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    paddingRight: '45px',
                    border: '2px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'Arial, sans-serif',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s',
                    backgroundColor: loading ? '#f5f5f5' : 'white',
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#003366'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#003366',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '18px',
                    padding: '5px'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 20px',
                backgroundColor: loading ? '#ccc' : '#FFD700',
                color: '#003366',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                marginTop: '10px'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = '#FFC700';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = '#FFD700';
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Info Section */}
          <div style={{
            marginTop: '30px',
            padding: '15px',
            backgroundColor: '#f0f8ff',
            border: '1px solid #003366',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#003366' }}>📋 Demo Credentials:</p>
            <p style={{ margin: '0 0 5px 0' }}>Email: <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '2px' }}>admin@mcs.edu.mm</code></p>
            <p style={{ margin: '0', color: '#999' }}>Password: Contact your administrator</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '0',
        right: '0',
        textAlign: 'center',
        fontSize: '12px',
        color: '#999'
      }}>
        <p>&copy; 2026 Myanmar Christianity School. All rights reserved.</p>
      </div>
    </div>
  );
}
