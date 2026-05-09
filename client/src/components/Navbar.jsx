import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, LogOut, Layout } from 'lucide-react';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  const handleDashboardClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Please Sign In first to access the Dashboard.");
      navigate('/login');
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        
        {/* LEFT MOST: Logo and Name */}
        <Link to="/" style={styles.logo}>
          <CheckSquare size={28} color="#2563eb" />
          <span style={styles.logoText}>Task Manager</span>
        </Link>

        {/* RIGHT MOST: Dashboard and Login/Logout */}
        <div style={styles.links}>
          <Link to="/dashboard" onClick={handleDashboardClick} style={styles.link}>
            <Layout size={18} /> Dashboard
          </Link>
          
          {user ? (
            <div style={styles.userSection}>
              <span style={styles.userName}>Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" style={styles.loginBtn}>Sign In</Link>
          )}
        </div>

      </div>
    </nav>
  );
};

const styles = {
  nav: { 
    background: '#ffffff', 
    borderBottom: '1px solid #e2e8f0', 
    width: '100%', 
    position: 'sticky', 
    top: 0, 
    zIndex: 1000 
  },
  container: { 
    width: '100%', // Removes the 1400px limit
    display: 'flex', 
    justifyContent: 'space-between', // Pushes children to opposite ends
    alignItems: 'center', 
    padding: '12px 20px', // Small padding so items aren't touching the literal glass of the screen
    boxSizing: 'border-box'
  },
  logo: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    textDecoration: 'none' 
  },
  logoText: { 
    fontWeight: '800', 
    fontSize: '1.4rem', 
    color: '#0f172a', 
    letterSpacing: '-0.5px' 
  },
  links: { 
    display: 'flex', 
    gap: '25px', 
    alignItems: 'center' 
  },
  link: { 
    textDecoration: 'none', 
    color: '#64748b', 
    fontWeight: '600', 
    fontSize: '14px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px' 
  },
  userSection: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px' 
  },
  userName: { 
    fontSize: '14px', 
    fontWeight: '700', 
    color: '#1e293b' 
  },
  loginBtn: { 
    background: '#2563eb', 
    color: 'white', 
    padding: '10px 20px', 
    borderRadius: '10px', 
    textDecoration: 'none', 
    fontSize: '14px', 
    fontWeight: '700' 
  },
  logoutBtn: { 
    background: '#fee2e2', 
    color: '#dc2626', 
    border: 'none', 
    padding: '8px 16px', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: '700', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px' 
  }
};

export default Navbar;