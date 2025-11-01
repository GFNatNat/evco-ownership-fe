import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authApi from '../api/authApi';

// User roles enum
const UserRole = {
  CoOwner: 0,
  Staff: 1,
  Admin: 2
};

// Auth state interface
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored tokens on app start
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedToken && storedUser && storedRefreshToken) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({
          type: 'LOGIN',
          payload: {
            accessToken: storedToken,
            refreshToken: storedRefreshToken,
            user,
          },
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.login(credentials);

      if (response.statusCode === 200) {
        const { accessToken, refreshToken, user } = response.data;

        // Store tokens and user data
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: 'LOGIN',
          payload: { accessToken, refreshToken, user },
        });

        return { success: true, user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.register(userData);

      if (response.statusCode === 201) {
        return { success: true, message: 'Registration successful! Please login.' };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.Password?.[0] ||
        error.message ||
        'Registration failed';
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  // Helper functions for role checking
  const isAdmin = () => state.user?.role === UserRole.Admin;
  const isStaff = () => state.user?.role === UserRole.Staff;
  const isCoOwner = () => state.user?.role === UserRole.CoOwner;

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
    isStaff,
    isCoOwner,
    UserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
