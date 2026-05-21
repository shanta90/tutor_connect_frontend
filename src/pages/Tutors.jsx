import { useSearchParams, Link } from 'react-router-dom';
import { useTutors } from '../hooks/useTutors';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Tutors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || 1;
  const minDate = searchParams.get('minDate') || '';
  const maxDate = searchParams.get('maxDate') || '';

  const { data, isLoading } = useTutors({ search, page, minDate, maxDate });

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // reset to page 1 on new filter
    if (key !== 'page') newParams.set('page', 1);
    setSearchParams(newParams);
  };

  return (
    <div>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Find Tutors</h1>
      
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto 3rem auto', padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 250px' }}>
          <label className="form-label">Search by Name/Subject</label>
          <input 
            className="form-input"
            placeholder="e.g. Math, John Doe"
            value={search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label className="form-label">Session Start (From)</label>
          <input 
            type="date"
            className="form-input"
            value={minDate}
            onChange={(e) => handleFilterChange('minDate', e.target.value)}
          />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label className="form-label">Session Start (To)</label>
          <input 
            type="date"
            className="form-input"
            value={maxDate}
            onChange={(e) => handleFilterChange('maxDate', e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid-3">
          <Skeleton height={300} borderRadius="10px" baseColor="#1f2028" highlightColor="#2e303a" />
          <Skeleton height={300} borderRadius="10px" baseColor="#1f2028" highlightColor="#2e303a" />
          <Skeleton height={300} borderRadius="10px" baseColor="#1f2028" highlightColor="#2e303a" />
        </div>
      ) : (
        <div className="grid-3">
          {data?.data?.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>No tutors found matching your criteria.</p>
          ) : (
            data?.data?.map(tutor => (
              <div key={tutor._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tutor.tutorImage && (
                  <img src={tutor.tutorImage} alt={tutor.tutorName} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)' }} />
                )}
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)' }}>{tutor.tutorName}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{tutor.subject}</p>
                  <p style={{ fontSize: '0.9rem' }}><strong>Start:</strong> {new Date(tutor.sessionStartDate).toLocaleDateString()}</p>
                  <p style={{ fontSize: '0.9rem' }}><strong>Fee:</strong> ${tutor.hourlyFee}/hr</p>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <Link to={`/tutors/${tutor._id}`} className="btn btn-primary" style={{ width: '100%' }}>View Details</Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tutors;
