import { Link } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="full-bg">
      <div className="page-container" style={styles.heroWrapper}>
        <div style={styles.content}>
          {/* Badge */}
          <div style={styles.badge}>
            <Rocket size={14} /> <span>Now with Role-Based Access</span>
          </div>

          <h1 style={styles.title}>
            Manage Your Team Tasks <br />
            <span style={{ color: '#2563eb' }}>with Ease</span>
          </h1>

          <p style={styles.subtitle}>
            The all-in-one platform to track progress, assign roles, and hit 
            your deadlines effectively. Built for modern development teams.
          </p>

          <div style={styles.btnGroup}>
            <Link to="/signup" style={styles.primaryBtn}>
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/login" style={styles.secondaryBtn}>
              Sign In to Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  heroWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '80vh', // Centers content vertically
    paddingTop: '60px',
    paddingBottom: '60px',
  },
  content: {
    maxWidth: '800px',
    width: '100%',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#eff6ff',
    color: '#2563eb',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '25px',
    border: '1px solid #dbeafe',
  },
  title: { 
    fontSize: 'clamp(2.5rem, 6vw, 4rem)', // Responsive font size
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: '1.1',
    margin: '0 0 24px 0',
    letterSpacing: '-1px'
  },
  subtitle: { 
    fontSize: '1.15rem', 
    color: '#64748b', 
    lineHeight: '1.6',
    marginBottom: '40px',
    maxWidth: '600px',
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  btnGroup: { 
    display: 'flex', 
    gap: '15px', 
    justifyContent: 'center',
    flexWrap: 'wrap' // Ensures buttons stack on small screens
  },
  primaryBtn: { 
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 32px', 
    background: '#2563eb', 
    color: 'white', 
    textDecoration: 'none', 
    borderRadius: '12px', 
    fontWeight: '700',
    fontSize: '16px',
    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
    transition: 'transform 0.2s'
  },
  secondaryBtn: { 
    padding: '16px 32px', 
    background: 'white',
    border: '1px solid #e2e8f0', 
    color: '#0f172a', 
    textDecoration: 'none', 
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '16px',
    transition: 'background 0.2s'
  }
};

export default Home;