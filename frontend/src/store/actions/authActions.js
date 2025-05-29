import axios from 'axios';


// Check auth status
export const checkAuthStatus = () => {
  return async dispatch => {
    dispatch({ type: 'AUTH_START' });
    
    const token = localStorage.getItem('token');
    if (!token) {
      return dispatch({ type: 'AUTH_FAIL' });
    }
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, config);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: data
      });
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response?.data?.message || 'Authentication failed'
      });
    }
  };
};

// Login user
export const login = (email, password) => {
  return async dispatch => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password
      });
      
      localStorage.setItem('token', data.token);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: data
      });
    } catch (error) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response?.data?.message || 'Login failed'
      });
    }
  };
};

// Register user
export const register = (name, email, password) => {
  return async dispatch => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        name,
        email,
        password
      });
      
      localStorage.setItem('token', data.token);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: data
      });
    } catch (error) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response?.data?.message || 'Registration failed'
      });
    }
  };
};

// Logout user
export const logout = () => {
  return dispatch => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };
};