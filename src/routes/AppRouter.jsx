import { Routes, Route } from 'react-router-dom';
import { PrivateRoute, GuestRoute } from './PrivateRoute';
import { MainLayout } from '../layouts/MainLayout';
import Home from '../pages/Home';
import Tutors from '../pages/Tutors';
import TutorDetails from '../pages/TutorDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyBookings from '../pages/MyBookings';
import MyTutors from '../pages/MyTutors';
import CreateTutor from '../pages/CreateTutor';
import NotFound from '../pages/NotFound';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tutors" element={<Tutors />} />
        <Route path="tutors/:id" element={<TutorDetails />} />
        
        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        <Route element={<PrivateRoute />}>
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="my-tutors" element={<MyTutors />} />
          <Route path="create-tutor" element={<CreateTutor />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
