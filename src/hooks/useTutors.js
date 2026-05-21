import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosInstance';

// Fetch single tutor
export const useTutor = (id) => useQuery({
  queryKey: ['tutor', id],
  queryFn: () => api.get(`/tutors/${id}`),
  enabled: !!id,
});

// Fetch all tutors (paginated/search/filter)
export const useTutors = ({ search, page, minDate, maxDate }) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (page) params.append('page', page);
  if (minDate) params.append('sessionStartDate[gte]', minDate);
  if (maxDate) params.append('sessionStartDate[lte]', maxDate);
  
  return useQuery({
    queryKey: ['tutors', search, page, minDate, maxDate],
    queryFn: () => api.get(`/tutors?${params.toString()}`),
  });
};

// Fetch my tutors
export const useMyTutors = () => useQuery({
  queryKey: ['myTutors'],
  queryFn: () => api.get('/tutors/my-tutors'),
});

// Create tutor
export const useCreateTutor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/tutors', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['myTutors']);
      queryClient.invalidateQueries(['tutors']);
    },
  });
};

// Update tutor
export const useUpdateTutor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/tutors/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['myTutors']);
      queryClient.invalidateQueries(['tutors']);
    },
  });
};

// Delete tutor
export const useDeleteTutor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/tutors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['myTutors']);
      queryClient.invalidateQueries(['tutors']);
    },
  });
};
