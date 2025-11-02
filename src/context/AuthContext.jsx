import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authApi from '../api/authApi';

// User roles enum
const UserRole = {
  CoOwner: 0,
  Staff: 1,
  Admin: 2
};

// Helper function to map role string to number
const mapRoleStringToNumber = (roleString) => {
  const roleMap = {
    'CoOwner': UserRole.CoOwner,
    'Staff': UserRole.Staff,
    'Admin': UserRole.Admin
  };
  return roleMap[roleString] !== undefined ? roleMap[roleString] : UserRole.CoOwner;
};

// Helper function to process user object from backend
const processUserFromBackend = (backendUser) => {
  if (!backendUser) return null;

  // Extract role from roles array (backend sends roles: ["CoOwner"])
  const roleString = backendUser.roles && backendUser.roles.length > 0
    ? backendUser.roles[0]
    : 'CoOwner';

  const role = mapRoleStringToNumber(roleString);

  console.log('🔄 Processing user from backend:', {
    backendUser,
    extractedRoleString: roleString,
    mappedRoleNumber: role
  });

  return {
    ...backendUser,
    role: role,
    roleString: roleString
  };
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

        // Process user object to handle both old format (role_enum) and new format (roles array)
        let processedUser;
        if (user.roles && Array.isArray(user.roles)) {
          // New format from backend
          processedUser = processUserFromBackend(user);
        } else {
          // Legacy format or already processed
          processedUser = {
            ...user,
            role: user.role_enum !== undefined ? user.role_enum : user.role
          };
        }

        dispatch({
          type: 'LOGIN',
          payload: {
            accessToken: storedToken,
            refreshToken: storedRefreshToken,
            user: processedUser,
          },
        });

        console.log('✅ User restored from localStorage:', processedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }

    // Always set loading to false after checking localStorage
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.login(credentials);

      // Check for successful response - either 200 statusCode or valid data structure
      if (response.statusCode === 200 || (response.data && response.data.accessToken)) {
        const { accessToken, refreshToken, user } = response.data || response;

        // Process user object to map roles array to role number
        const processedUser = processUserFromBackend(user);

        // Store tokens and user data
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(processedUser));

        dispatch({
          type: 'LOGIN',
          payload: { accessToken, refreshToken, user: processedUser },
        });

        return { success: true, user: processedUser };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);

      // Check if the error response actually contains valid login data
      if (error.response?.data?.data?.accessToken) {
        console.warn('⚠️ Login error but response contains valid tokens - processing as success');
        const { accessToken, refreshToken, user } = error.response.data.data;

        // Process user object to map roles array to role number
        const processedUser = processUserFromBackend(user);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(processedUser));

        dispatch({
          type: 'LOGIN',
          payload: { accessToken, refreshToken, user: processedUser },
        });

        return { success: true, user: processedUser };
      }

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

      // Check for successful response - either 201 statusCode or valid success indicator
      if (response.statusCode === 201 || response.statusCode === 200 ||
        (response.message && response.message.includes('success'))) {
        return { success: true, message: 'Registration successful! Please login.' };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);

      // Check if the error response actually indicates successful registration
      if (error.response?.data?.statusCode === 201 ||
        error.response?.data?.statusCode === 200 ||
        (error.response?.data?.message && error.response.data.message.includes('success'))) {
        console.warn('⚠️ Registration error but response indicates success');
        return { success: true, message: 'Registration successful! Please login.' };
      }

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
