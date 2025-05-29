import axios from 'axios';

// Get auth header
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Fetch budgets
export const fetchBudgets = () => {
  return async dispatch => {
    dispatch({ type: 'FETCH_BUDGETS_START' });
    
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/budgets`, getConfig());
      
      dispatch({
        type: 'FETCH_BUDGETS_SUCCESS',
        payload: data
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_BUDGETS_FAIL',
        payload: error.response?.data?.message || 'Failed to fetch budgets'
      });
    }
  };
};

// Add budget
export const addBudget = (budget) => {
  return async dispatch => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/budgets`,
        budget,
        getConfig()
      );
      
      dispatch({
        type: 'ADD_BUDGET',
        payload: data
      });
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };
};

// Update budget
export const updateBudget = (budget) => {
  return async dispatch => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/budgets/${budget._id}`,
        budget,
        getConfig()
      );
      
      dispatch({
        type: 'UPDATE_BUDGET',
        payload: data
      });
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };
};

// Delete budget
export const deleteBudget = (id) => {
  return async dispatch => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/budgets/${id}`, getConfig());
      
      dispatch({
        type: 'DELETE_BUDGET',
        payload: id
      });
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };
};