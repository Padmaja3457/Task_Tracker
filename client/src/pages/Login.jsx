import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/dashboard'); 
    } catch (err) {
      alert(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="full-bg">
      <div className="page-container" style={styles.container}>
        <div style={styles.card}>
          <div style={styles.headerSection}>
            <div style={styles.iconCircle}>
              <LogIn size={24} color="#2563eb" />
            </div>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Enter your details to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.button}>Sign In</button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account? 
              <Link to="/signup" style={styles.link}>
                 Create one for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  // Added this to center the card within the page-container
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '85vh', 
    padding: '40px 0'
  },
  card: { 
    background: '#ffffff',
    padding: '40px', 
    borderRadius: '24px', 
    width: '100%',
    maxWidth: '450px', 
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
    fontSize: '26px', 
    fontWeight: '800', 
    color: '#0f172a',
    margin: '0 0 10px 0',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '14px',
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
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
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
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
  },
  footer: {
    marginTop: '25px',
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
    marginLeft: '5px'
  }
};

export default Login;