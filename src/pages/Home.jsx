import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useState, useEffect } from 'react';

const carouselData = [
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
    title: 'Unlock Your Potential',
    subtitle: 'Learn from industry experts from anywhere in the world.'
  },
  {
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
    title: 'Master New Skills',
    subtitle: 'From web development to mathematics, we have a tutor for you.'
  },
  {
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80',
    title: 'Personalized Learning',
    subtitle: '1-on-1 sessions tailored specifically to your learning pace.'
  }
];

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-tutors'],
    queryFn: () => api.get('/tutors?limit=6'),
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-container">
      {/* Banner Section / Carousel */}
      <section className="hero-section text-center" style={{ 
        position: 'relative', 
        height: '500px', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 'var(--border-radius-lg)',
        marginBottom: '4rem'
      }}>
        {carouselData.map((slide, idx) => (
          <div key={idx} style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: idx === currentSlide ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: -1
          }}></div>
        ))}
        
        <h1 className="title" style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          {carouselData[currentSlide].title}
        </h1>
        <p className="subtitle" style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#e2e8f0' }}>
          {carouselData[currentSlide].subtitle}
        </p>
        <Link to="/tutors" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>Browse Tutors</Link>
      </section>

      {/* Available Tutors Section */}
      <section className="featured-section" style={{ marginTop: '5rem' }}>
        <h2 className="title" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Available Tutors</h2>
        {isLoading ? (
          <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} height={350} borderRadius="10px" baseColor="#1f2028" highlightColor="#2e303a" />)}
          </div>
        ) : (
          <div className="grid-3">
            {data?.data?.map((tutor) => (
              <div key={tutor._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <img 
                  src={tutor.tutorImage} 
                  alt={tutor.tutorName} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)' }} 
                />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{tutor.tutorName}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{tutor.subject}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>${tutor.hourlyFee}/hr</span>
                  <Link to={`/tutors/${tutor._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Book Session</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Extra Section 1: How It Works */}
      <section style={{ marginTop: '7rem', textAlign: 'center' }}>
        <h2 className="title" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>How It Works</h2>
        <div className="grid-3">
          <div className="glass-panel text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>1. Find a Tutor</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Browse our extensive list of verified and highly-rated tutors across various subjects.</p>
          </div>
          <div className="glass-panel text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>2. Book a Session</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Select an available time slot and book your 1-on-1 personalized learning session.</p>
          </div>
          <div className="glass-panel text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>3. Start Learning</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Connect online and start mastering your subject with your dedicated tutor.</p>
          </div>
        </div>
      </section>

      {/* Extra Section 2: Why Choose Us */}
      <section style={{ marginTop: '7rem', marginBottom: '4rem' }}>
        <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem', padding: '4rem' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 className="title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Choose TutorConnect?</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
                <span style={{ color: 'var(--success-color)' }}>✓</span> Verified Expert Tutors
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
                <span style={{ color: 'var(--success-color)' }}>✓</span> Flexible Scheduling
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
                <span style={{ color: 'var(--success-color)' }}>✓</span> Affordable Hourly Rates
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
                <span style={{ color: 'var(--success-color)' }}>✓</span> 100% Satisfaction Guarantee
              </li>
            </ul>
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <img 
              src="/why_choose_us.png" 
              alt="Students learning" 
              style={{ width: '100%', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--glass-shadow)' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
