import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, AuthAction, User } from '../types/auth';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_INIT_START':
      return {
        ...state,
        isInitializing: true,
      };
    case 'AUTH_INIT_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isInitializing: false,
        error: null,
      };
    case 'AUTH_INIT_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isInitializing: false,
        error: null,
      };
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize session checks
  const initializeAuth = useCallback(async () => {
    dispatch({ type: 'AUTH_INIT_START' });
    const token = storage.get<string>('auth_token');
    const user = storage.get<User>('auth_user');

    if (token && user) {
      try {
        // Attempt to verify with API/Service
        const verifiedUser = await authService.getCurrentUser();
        dispatch({
          type: 'AUTH_INIT_SUCCESS',
          payload: { user: verifiedUser, token },
        });
      } catch (error) {
        console.error('Session validation failed. Clearing credentials.', error);
        authService.logout();
        dispatch({ type: 'AUTH_INIT_FAILURE' });
      }
    } else {
      dispatch({ type: 'AUTH_INIT_FAILURE' });
    }
  }, []);

  useEffect(() => {
    initializeAuth();

    // Catch global 401 unauthorized triggers from Axios interceptor
    const handleUnauthorized = () => {
      dispatch({ type: 'LOGOUT' });
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, [initializeAuth]);

  // Login handler
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await authService.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || error?.message || 'Login failed. Please check your credentials.';
      dispatch({ type: 'LOGIN_FAILURE', payload: errMsg });
      throw new Error(errMsg);
    }
  };

  // Logout handler
  const logout = async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
