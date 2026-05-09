import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://tasktracker-production-9ded.up.railway.app/api/auth/signup', formData);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="full-bg">
      <div className="page-container" style={styles.container}>
        <div style={styles.card}>
          <div style={styles.headerSection}>
            <div style={styles.iconCircle}>
              <UserPlus size={24} color="#2563eb" />
            </div>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Start managing your team effectively today.</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                onChange={(e)=>setFormData({...formData, name: e.target.value})} 
                style={styles.input} 
                required 
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                onChange={(e)=>setFormData({...formData, email: e.target.value})} 
                style={styles.input} 
                required 
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                placeholder="Create a strong password" 
                onChange={(e)=>setFormData({...formData, password: e.target.value})} 
                style={styles.input} 
                required 
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Account Type</label>
              <div style={styles.selectWrapper}>
                <select 
                  onChange={(e)=>setFormData({...formData, role: e.target.value})} 
                  style={styles.select}
                >
                  <option value="Member">Member (View & Complete Tasks)</option>
                  <option value="Admin">Admin (Assign & Manage Tasks)</option>
                </select>
              </div>
            </div>

            <button type="submit" style={styles.button}>Get Started</button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account? 
              <Link to="/login" style={styles.link}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  // Centers the card horizontally and vertically
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '90vh', 
    padding: '40px 0'
  },
  card: { 
    background: '#ffffff',
    padding: '40px', 
    borderRadius: '24px', 
    width: '100%',
    maxWidth: '480px', 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    border: '1px solid #f1f5f9'
  },
  headerSection: {
    marginBottom: '30px'
  },
  iconCircle: {
    width: '56px',
    height: '56px',
    background: '#eff6ff',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto'
  },
  title: { 
    fontSize: '28px', 
    fontWeight: '800', 
    color: '#0f172a',
    margin: '0 0 10px 0',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  inputGroup: {
    textAlign: 'left'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '8px'
  },
  input: { 
    width: '100%', 
    padding: '12px 16px', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outlineColor: '#2563eb',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    background: '#fff',
    cursor: 'pointer',
    outlineColor: '#2563eb',
    boxSizing: 'border-box'
  },
  button: { 
    width: '100%', 
    padding: '16px', 
    background: '#2563eb', 
    color: 'white', 
    border: 'none', 
    borderRadius: '12px', 
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '700',
    marginTop: '10px',
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)'
  },
  footer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #f1f5f9'
  },
  footerText: {
    fontSize: '14px',
    color: '#64748b'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '700',
    marginLeft: '8px'
  }
};

export default Signup;