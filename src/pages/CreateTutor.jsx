import { useForm } from 'react-hook-form';
import { useCreateTutor } from '../hooks/useTutors';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const subjects = ['Mathematics', 'Physics', 'English', 'Computer Science', 'Biology', 'History', 'Other'];
const teachingModes = ['Live', 'Offline', 'Hybrid'];

const CreateTutor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const mutation = useCreateTutor();
  const [isUploading, setIsUploading] = useState(false);

  const uploadToImgbb = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      // Use env variable or fallback
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '30ba81414e21cfb9c2409f8c6edc8fdf'; // example key format, using public one if possible or just rely on fallback
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) return data.data.display_url;
      return null;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      let imageUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60';
      
      if (data.photo && data.photo.length > 0) {
        const uploadedUrl = await uploadToImgbb(data.photo[0]);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }
      setIsUploading(false);

      await mutation.mutateAsync({
        tutorName: user.name,
        creatorEmail: user.email,
        tutorImage: imageUrl,
        availableDays: data.availableDays.split(',').map(d => d.trim()),
        availableTime: data.availableTime,
        sessionStartDate: data.sessionStartDate,
        institution: data.institution,
        experience: data.experience,
        location: data.location,
        teachingMode: data.teachingMode,
        subject: data.subject,
        hourlyFee: Number(data.hourlyFee),
        totalSlot: Number(data.totalSlot)
      });
      
      toast.success('Tutor profile created successfully!');
      navigate('/my-tutors');
    } catch (err) {
      setIsUploading(false);
      toast.error(err.message || 'Failed to create tutor profile');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Become a Tutor</h1>
      
      <div className="glass-panel">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tutor Name</label>
              <input defaultValue={user?.name} className="form-input" readOnly style={{ opacity: 0.7 }} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Photo (Upload)</label>
              <input 
                type="file" 
                accept="image/*"
                {...register('photo')} 
                className="form-input" 
                style={{ padding: '0.5rem' }}
              />
            </div>
          </div>

          <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Subject</label>
              <select {...register('subject', { required: 'Subject is required' })} className="form-input" style={{ appearance: 'auto', backgroundColor: 'var(--bg-color)' }}>
                <option value="">Select a subject</option>
                {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
              {errors.subject && <span style={{ color: 'var(--danger-color)', fontSize: '0.85rem' }}>{errors.subject.message}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Teaching Mode</label>
              <select {...register('teachingMode', { required: 'Mode is required' })} className="form-input" style={{ appearance: 'auto', backgroundColor: 'var(--bg-color)' }}>
                <option value="">Select teaching mode</option>
                {teachingModes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
              </select>
              {errors.teachingMode && <span style={{ color: 'var(--danger-color)', fontSize: '0.85rem' }}>{errors.teachingMode.message}</span>}
            </div>
          </div>

          <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Available Days (comma separated)</label>
              <input 
                {...register('availableDays', { required: 'Required' })} 
                placeholder="e.g. Monday, Wednesday" 
                className="form-input" 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Available Time</label>
              <input 
                {...register('availableTime', { required: 'Required' })} 
                placeholder="e.g. 10:00 AM - 12:00 PM" 
                className="form-input" 
              />
            </div>
          </div>

          <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Hourly Fee ($)</label>
              <input 
                type="number" min="1"
                {...register('hourlyFee', { required: 'Required' })} 
                className="form-input" 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Total Slots</label>
              <input 
                type="number" min="1"
                {...register('totalSlot', { required: 'Required' })} 
                className="form-input" 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Session Start Date</label>
              <input 
                type="date"
                {...register('sessionStartDate', { required: 'Required' })} 
                className="form-input" 
              />
            </div>
          </div>

          <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Institution</label>
              <input 
                {...register('institution', { required: 'Required' })} 
                placeholder="e.g. Oxford University" 
                className="form-input" 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Experience</label>
              <input 
                {...register('experience', { required: 'Required' })} 
                placeholder="e.g. 5 Years" 
                className="form-input" 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input 
              {...register('location', { required: 'Required' })} 
              placeholder="e.g. Online, or City Name" 
              className="form-input" 
            />
          </div>

          <button disabled={mutation.isPending || isUploading} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
            {isUploading ? 'Uploading Image...' : mutation.isPending ? 'Creating Profile...' : 'Create Tutor Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTutor;
