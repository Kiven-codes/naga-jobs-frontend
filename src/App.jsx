import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://naga-jobs-backend.onrender.com/api';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (user.role === 'applicant') {
      const res = await fetch(`${API_URL}/jobs`);
      const data = await res.json();
      setJobs(data);

      const appRes = await fetch(`${API_URL}/applications/${user.user_id}`);
      const appData = await appRes.json();
      setApplications(appData);
    } else if (user.role === 'company') {
      const res = await fetch(`${API_URL}/company-jobs/${user.user_id}`);
      const data = await res.json();
      setMyJobs(data);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setView('dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setView('login');
  };

  const applyJob = async (jobId) => {
    const res = await fetch(`${API_URL}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId, user_id: user.user_id })
    });

    if (res.ok) {
      alert('Application submitted!');
      loadData();
    }
  };

  const postJob = async (jobTitle, skills, location) => {
    const res = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: user.user_id,
        job_title: jobTitle,
        required_skills: skills,
        location 
      })
    });

    if (res.ok) {
      alert('Job posted!');
      loadData();
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    const res = await fetch(`${API_URL}/applications/${appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      alert('Status updated!');
      loadData();
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand mb-0 h1">🏢 NAGA JOBS</span>
          {user && (
            <div className="text-white">
              <span className="me-3">{user.email}</span>
              <button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div className="container py-4">
        {view === 'login' && <LoginView onLogin={login} onRegister={() => setView('register')} />}
        {view === 'register' && <RegisterView onBack={() => setView('login')} />}
        {view === 'dashboard' && user && (
          user.role === 'applicant' ? (
            <ApplicantDashboard 
              jobs={jobs} 
              applications={applications} 
              onApply={applyJob} 
            />
          ) : (
            <CompanyDashboard 
              myJobs={myJobs} 
              onPostJob={postJob}
              onUpdateStatus={updateApplicationStatus}
            />
          )
        )}
      </div>
    </div>
  );
}

function LoginView({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onLogin(email, password);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow">
          <div className="card-body p-4">
            <h3 className="text-center mb-4">Login</h3>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button onClick={handleSubmit} className="btn btn-primary w-100">Login</button>
            <div className="text-center mt-3">
              <small>Demo: juan@gmail.com / 12345 (Applicant)</small><br/>
              <small>Demo: HR1@gmail.com / 12345 (Company)</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterView({ onBack }) {
  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow">
          <div className="card-body p-4">
            <h3 className="text-center mb-4">Register</h3>
            <p className="text-center text-muted">Registration feature - use demo accounts</p>
            <button className="btn btn-secondary w-100" onClick={onBack}>Back to Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicantDashboard({ jobs, applications, onApply }) {
  const appliedJobIds = applications.map(app => app.job_id);

  return (
    <div>
      <h2 className="mb-4">Available Jobs in Naga City</h2>
      
      <div className="row">
        {jobs.map(job => (
          <div key={job.job_id} className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{job.job_title}</h5>
                <h6 className="text-muted">{job.company_name}</h6>
                <p className="mb-1"><strong>Skills:</strong> {job.required_skills}</p>
                <p className="mb-3"><strong>Location:</strong> {job.location}</p>
                {appliedJobIds.includes(job.job_id) ? (
                  <span className="badge bg-secondary">Already Applied</span>
                ) : (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => onApply(job.job_id)}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-5 mb-3">My Applications</h3>
      <div className="table-responsive">
        <table className="table table-bordered bg-white">
          <thead className="table-light">
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.application_id}>
                <td>{app.job_title}</td>
                <td>{app.company_name}</td>
                <td>
                  <span className={`badge ${
                    app.status === 'Accepted' ? 'bg-success' : 
                    app.status === 'Rejected' ? 'bg-danger' : 'bg-warning'
                  }`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompanyDashboard({ myJobs, onPostJob, onUpdateStatus }) {
  const [showForm, setShowForm] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('Naga City');

  const handleSubmit = () => {
    onPostJob(jobTitle, skills, location);
    setJobTitle('');
    setSkills('');
    setLocation('Naga City');
    setShowForm(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Job Postings</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Post New Job'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Job Title</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Required Skills</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <button onClick={handleSubmit} className="btn btn-success">Post Job</button>
          </div>
        </div>
      )}

      {myJobs.map(job => (
        <div key={job.job_id} className="card mb-3">
          <div className="card-body">
            <h5>{job.job_title}</h5>
            <p className="mb-1"><strong>Skills:</strong> {job.required_skills}</p>
            <p className="mb-3"><strong>Location:</strong> {job.location}</p>
            
            <h6 className="mt-3">Applications ({job.applications?.length || 0})</h6>
            {job.applications && job.applications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Skills</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.applications.map(app => (
                      <tr key={app.application_id}>
                        <td>{app.full_name}</td>
                        <td>{app.skills}</td>
                        <td>
                          <span className={`badge ${
                            app.status === 'Accepted' ? 'bg-success' : 
                            app.status === 'Rejected' ? 'bg-danger' : 'bg-warning'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          {app.status === 'Pending' && (
                            <>
                              <button 
                                className="btn btn-success btn-sm me-1"
                                onClick={() => onUpdateStatus(app.application_id, 'Accepted')}
                              >
                                Accept
                              </button>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => onUpdateStatus(app.application_id, 'Rejected')}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted small">No applications yet</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;