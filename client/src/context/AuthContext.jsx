import { createContext, useReducer, useEffect } from 'react';
import { getMe } from '../api/auth';

export const AuthContext = createContext();

const token = localStorage.getItem('sakura-token');

const initialState = {
  user: null,
  token: token || null,
  loading: !!token, // loading if we have a token to verify
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case 'AUTH_FAIL':
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount, verify token by fetching current user
  useEffect(() => {
    if (state.token) {
      getMe()
        .then((res) => dispatch({ type: 'USER_LOADED', payload: res.data }))
        .catch(() => {
          localStorage.removeItem('sakura-token');
          dispatch({ type: 'AUTH_FAIL' });
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (data) => {
    localStorage.setItem('sakura-token', data.token);
    dispatch({ type: 'AUTH_SUCCESS', payload: data });
  };

  const logout = () => {
    localStorage.removeItem('sakura-token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        loading: state.loading,
        isAuthenticated: !!state.user,
        isAdmin: state.user?.role === 'admin',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
