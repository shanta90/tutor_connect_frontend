import { useMyBookings, useCancelBooking } from '../hooks/useBookings';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import 'react-loading-skeleton/dist/skeleton.css';
import { useState } from 'react';

const MyBookings = () => {
  const { data, isLoading } = useMyBookings();
  const cancelMutation = useCancelBooking();
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async () => {
    if (!cancellingId) return;
    try {
      await cancelMutation.mutateAsync(cancellingId);
      toast.success('Booking cancelled');
      setCancellingId(null);
    } catch (err) {
      toast.error(err.message || 'Failed to cancel');
    }
  };

  return (
    <div>
      <h1 className="title" style={{ marginBottom: '2rem' }}>My Bookings</h1>
      
      {isLoading ? (
        <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <Skeleton count={5} height={60} baseColor="#1f2028" highlightColor="#2e303a" />
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          {!data?.data || data.data.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No bookings found. You haven't booked any sessions yet.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tutor</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map(booking => (
                  <tr key={booking._id}>
                    <td style={{ fontWeight: 500 }}>{booking.tutorName}</td>
                    <td>{booking.studentName}</td>
                    <td>{booking.studentEmail}</td>
                    <td>
                      <span className={`badge ${booking.bookingStatus === 'booked' ? 'badge-success' : 'badge-danger'}`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {booking.bookingStatus !== 'cancelled' && (
                        <button onClick={() => setCancellingId(booking._id)} className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {cancellingId && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--danger-color)' }}>Cancel Session</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Are you sure you want to cancel this booking? This action cannot be undone.</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button type="button" onClick={() => setCancellingId(null)} className="btn btn-secondary">No, Keep it</button>
              <button disabled={cancelMutation.isPending} onClick={handleCancel} className="btn btn-danger">
                {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
