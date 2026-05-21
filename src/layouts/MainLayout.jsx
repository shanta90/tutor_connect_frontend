import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/auth.api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { Footer } from '../components/Footer';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  const toggleTheme = () => setIsLightMode(!isLightMode);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logout();
      queryClient.setQueryData(['auth-me'], null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>TutorConnect</Link>
        
        <div className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </div>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
          <Link to="/tutors" className="nav-link" onClick={closeMobileMenu}>Tutors</Link>
          
          <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
            {isLightMode ? '🌙' : '☀️'}
          </button>

          {user ? (
            <>
              <div className="profile-dropdown">
                <img 
                  src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                  alt="Profile" 
                  className="profile-img"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--surface-border)', marginBottom: '0.25rem' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</p>
                    </div>
                    <Link to="/my-bookings" className="dropdown-item" onClick={() => {setDropdownOpen(false); closeMobileMenu();}}>My Booked Sessions</Link>
                    <Link to="/my-tutors" className="dropdown-item" onClick={() => {setDropdownOpen(false); closeMobileMenu();}}>My Tutors</Link>
                    <Link to="/create-tutor" className="dropdown-item" onClick={() => {setDropdownOpen(false); closeMobileMenu();}}>Add Tutor</Link>
                    <button onClick={() => {handleLogout(); closeMobileMenu();}} className="dropdown-item" style={{ color: 'var(--danger-color)' }}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={closeMobileMenu}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'TutorConnect';
    if (path.includes('/tutors')) title = 'Tutors | TutorConnect';
    if (path.includes('/login')) title = 'Login | TutorConnect';
    if (path.includes('/register')) title = 'Register | TutorConnect';
    if (path.includes('/my-bookings')) title = 'My Bookings | TutorConnect';
    if (path.includes('/my-tutors')) title = 'My Tutors | TutorConnect';
    if (path.includes('/create-tutor')) title = 'Become a Tutor | TutorConnect';
    document.title = title;
  }, [location]);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
