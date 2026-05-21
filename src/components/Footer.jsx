import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{ background: 'rgba(0,0,0,0.2)', padding: '3rem 2rem', marginTop: 'auto', borderTop: '1px solid var(--surface-border)' }}>
      <div className="grid-3" style={{ maxWidth: '1200px', margin: '0 auto', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>TutorConnect</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Connecting students with expert tutors worldwide for personalized learning experiences.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Services</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/tutors" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Find a Tutor</Link></li>
            <li><Link to="/create-tutor" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Become a Tutor</Link></li>
            <li><Link to="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Online Classes</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Contact & Social</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ color: 'var(--text-secondary)' }}>Email: support@tutorconnect.com</li>
            <li style={{ color: 'var(--text-secondary)' }}>Phone: +1 234 567 8900</li>
            <li style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <a href="#" style={{ color: 'var(--primary-accent)', textDecoration: 'none' }}>Twitter (X)</a>
              <a href="#" style={{ color: 'var(--primary-accent)', textDecoration: 'none' }}>LinkedIn</a>
              <a href="#" style={{ color: 'var(--primary-accent)', textDecoration: 'none' }}>Facebook</a>
            </li>
          </ul>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--surface-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} TutorConnect. All rights reserved.
      </div>
    </footer>
  );
};
