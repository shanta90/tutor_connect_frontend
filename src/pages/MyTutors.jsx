import { useMyTutors, useDeleteTutor, useUpdateTutor } from '../hooks/useTutors';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import 'react-loading-skeleton/dist/skeleton.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const MyTutors = () => {
  const { data, isLoading } = useMyTutors();
  const deleteMutation = useDeleteTutor();
  const updateMutation = useUpdateTutor();
  
  const [editingTutor, setEditingTutor] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tutor profile?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Tutor profile deleted');
      } catch (err) {
        toast.error(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div>
      <h1 className="title" style={{ marginBottom: '2rem' }}>My Tutor Profiles</h1>
      
      {isLoading ? (
        <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <Skeleton count={5} height={60} baseColor="#1f2028" highlightColor="#2e303a" />
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          {!data?.data || data.data.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No tutor profiles created yet.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Fee / hr</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map(tutor => (
                  <tr key={tutor._id}>
                    <td style={{ fontWeight: 500 }}>{tutor.tutorName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{tutor.subject}</td>
                    <td>${tutor.hourlyFee}</td>
                    <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditingTutor(tutor)} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Update</button>
                      <button onClick={() => handleDelete(tutor._id)} className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {editingTutor && (
        <UpdateTutorModal 
          tutor={editingTutor} 
          onClose={() => setEditingTutor(null)} 
          mutation={updateMutation} 
        />
      )}
    </div>
  );
};

const UpdateTutorModal = ({ tutor, onClose, mutation }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      hourlyFee: tutor.hourlyFee,
      totalSlot: tutor.totalSlot,
      sessionStartDate: new Date(tutor.sessionStartDate).toISOString().split('T')[0],
      location: tutor.location,
    }
  });

  const onSubmit = async (data) => {
    try {
      await mutation.mutateAsync({ 
        id: tutor._id, 
        data: {
          hourlyFee: Number(data.hourlyFee),
          totalSlot: Number(data.totalSlot),
          sessionStartDate: data.sessionStartDate,
          location: data.location,
        }
      });
      toast.success('Tutor profile updated');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit(onSubmit)} className="modal-content glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Update Profile</h2>
        
        <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Hourly Fee ($)</label>
            <input type="number" min="0" {...register('hourlyFee', { required: true })} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Total Slots</label>
            <input type="number" min="1" {...register('totalSlot', { required: true })} className="form-input" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Session Start Date</label>
          <input type="date" {...register('sessionStartDate', { required: true })} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input {...register('location', { required: true })} className="form-input" />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Updating...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
};

export default MyTutors;
