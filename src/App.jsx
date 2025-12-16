import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [view, setView] = useState('home');
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', role: 'applicant' });

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${API_URL}/companies`);
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setView('home');
        alert('Login successful!');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Login error');
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      alert(data.message);
      if (data.userId) {
        setView('login');
      }
    } catch (err) {
      alert('Registration error');
    }
  };

  const handleApply = async (jobId) => {
    if (!user) {
      alert('Please login to apply');
      setView('login');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          applicantId: user.user_id, 
          jobId,
          status: 'pending'
        })
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert('Error applying for job');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <nav style={{ 
        backgroundColor: '#0d6efd', 
        padding: '1rem 0',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <h2 style={{ margin: 0, fontWeight: 'bold' }}>NAGA JOBS</h2>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Home</button>
              <button onClick={() => setView('jobs')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Jobs</button>
              <button onClick={() => setView('companies')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Companies</button>
              {user ? (
                <>
                  <span>Hello, {user.email}</span>
                  <button onClick={() => { setUser(null); setView('home'); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Login</button>
                  <button onClick={() => setView('register')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Register</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {view === 'home' && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome to Naga Jobs</h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#6c757d' }}>
              Online Job Portal and Applicant Tracking System in Naga City, Camarines Sur, Philippines
            </p>
            <button 
              onClick={() => setView('jobs')}
              style={{
                backgroundColor: '#0d6efd',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                fontSize: '1.1rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              Browse Jobs
            </button>
            <button 
              onClick={() => setView('companies')}
              style={{
                backgroundColor: 'white',
                color: '#0d6efd',
                border: '2px solid #0d6efd',
                padding: '0.75rem 2rem',
                fontSize: '1.1rem',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              View Companies
            </button>
          </div>
        )}

        {view === 'login' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                <input 
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                <input 
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                />
              </div>
              <button 
                onClick={handleLogin}
                style={{
                  width: '100%',
                  backgroundColor: '#0d6efd',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Login
              </button>
            </div>
          </div>
        )}

        {view === 'register' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register</h2>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                <input 
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                <input 
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Role</label>
                <select
                  value={registerData.role}
                  onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                >
                  <option value="applicant">Applicant</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
              <button 
                onClick={handleRegister}
                style={{
                  width: '100%',
                  backgroundColor: '#0d6efd',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Register
              </button>
            </div>
          </div>
        )}

        {view === 'jobs' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Available Jobs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {jobs.map(job => (
                <div key={job.job_id} style={{ 
                  backgroundColor: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                }}>
                  <h5 style={{ marginBottom: '0.5rem' }}>{job.job_title}</h5>
                  <h6 style={{ color: '#6c757d', marginBottom: '1rem' }}>{job.company_name}</h6>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    <strong>Skills Required:</strong> {job.req_skills}
                  </p>
                  <button 
                    onClick={() => handleApply(job.job_id)}
                    style={{
                      backgroundColor: '#0d6efd',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1.5rem',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'companies' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Companies</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {companies.map(company => (
                <div key={company.company_id} style={{ 
                  backgroundColor: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                }}>
                  <h5 style={{ marginBottom: '0.5rem' }}>{company.company_name}</h5>
                  <p style={{ color: '#6c757d' }}>
                    <strong>Location:</strong> {company.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{ 
        backgroundColor: '#212529', 
        color: 'white', 
        textAlign: 'center', 
        padding: '1.5rem', 
        marginTop: '3rem' 
      }}>
        <p style={{ margin: 0 }}>© 2024 Naga Jobs - Online Job Portal and Applicant Tracking System</p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#adb5bd' }}>Naga City, Camarines Sur, Philippines</p>
      </footer>
    </div>
  );
}

export default App;