import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTutor } from '../hooks/useTutors';
import { useCreateBooking } from '../hooks/useBookings';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TutorDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const { data: tutorRes, isLoading, isError } = useTutor(id);
  const tutor = tutorRes?.data;
  const bookingMutation = useCreateBooking();

  if (isLoading) return <Skeleton height={400} baseColor="#1f2028" highlightColor="#2e303a" />;
  if (isError || !tutor) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
      <h2>Tutor not found</h2>
      <p>This tutor profile may have been removed.</p>
    </div>
  );

  const handleBookClick = () => {
    if (!user) {
      toast.warn('Please login to book a session');
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h1 className="title">{tutor.tutorName}</h1>
        <p className="subtitle" style={{ color: 'var(--primary-accent)', fontWeight: 500, fontSize: '1.2rem' }}>{tutor.subject}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '2rem 0', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Hourly Rate</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>${tutor.hourlyFee}</p>
          </div>
          <div style={{ width: '1px', background: 'var(--surface-border)' }}></div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Available Slots</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{tutor.totalSlot}</p>
          </div>
        </div>

        <button onClick={handleBookClick} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Book Session</button>
      </div>

      {showModal && (
        <BookingModal 
          tutor={tutor} 
          user={user} 
          onClose={() => setShowModal(false)}
          mutation={bookingMutation}
        />
      )}
    </div>
  );
};

const BookingModal = ({ tutor, user, onClose, mutation }) => {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await mutation.mutateAsync({ 
        tutorId: tutor._id, 
        tutorName: tutor.tutorName, 
        phone: data.phone
      });
      toast.success('Booking successful');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.message || 'Booking failed');
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit(onSubmit)} className="modal-content glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Book {tutor.tutorName}</h2>
        
        <div className="form-group">
          <label className="form-label">Tutor ID</label>
          <input defaultValue={tutor._id} className="form-input" readOnly style={{ opacity: 0.7 }} />
        </div>

        <div className="form-group">
          <label className="form-label">Tutor Name</label>
          <input defaultValue={tutor.tutorName} className="form-input" readOnly style={{ opacity: 0.7 }} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Student Name</label>
          <input defaultValue={user.name} className="form-input" readOnly style={{ opacity: 0.7 }} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Student Email</label>
          <input defaultValue={user.email} className="form-input" readOnly style={{ opacity: 0.7 }} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input {...register('phone', { required: true })} placeholder="Enter your phone number" className="form-input" />
          {errors.phone && <span style={{ color: 'var(--danger-color)', fontSize: '0.85rem' }}>Phone is required</span>}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Booking...' : 'Confirm'}</button>
        </div>
      </form>
    </div>
  );
};

export default TutorDetails;
