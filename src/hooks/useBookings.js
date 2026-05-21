import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosInstance';

// Fetch my bookings
export const useMyBookings = () => useQuery({
  queryKey: ['myBookings'],
  queryFn: () => api.get('/bookings/my-bookings'),
});

// Book a session
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/bookings', data),
    onSuccess: () => queryClient.invalidateQueries(['myBookings']),
  });
};

// Cancel a booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(`/bookings/${id}/cancel`),
    onSuccess: () => queryClient.invalidateQueries(['myBookings']),
  });
};
