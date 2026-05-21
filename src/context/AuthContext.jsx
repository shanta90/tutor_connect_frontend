import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as authApi from '../api/auth.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ['auth-me'],
    queryFn: authApi.getMe,
    retry: false,
  });

  // TanStack Query v5 removed onSuccess/onError — use useEffect instead
  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    } else if (!isLoading && data === undefined) {
      setUser(null);
    }
  }, [data, isLoading]);

  const login = (userData) => {
    setUser(userData);
    queryClient.setQueryData(['auth-me'], { status: 'success', data: userData });
  };

  const logout = () => {
    setUser(null);
    queryClient.setQueryData(['auth-me'], null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
