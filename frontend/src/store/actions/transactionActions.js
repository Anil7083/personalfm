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

// Fetch transactions
export const fetchTransactions = () => {
  return async dispatch => {
    dispatch({ type: 'FETCH_TRANSACTIONS_START' });
    
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, getConfig());
      
      dispatch({
        type: 'FETCH_TRANSACTIONS_SUCCESS',
        payload: data
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_TRANSACTIONS_FAIL',
        payload: error.response?.data?.message || 'Failed to fetch transactions'
      });
    }
  };
};

// Add transaction
export const addTransaction = (transaction) => {
  return async dispatch => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions`,
        transaction,
        getConfig()
      );
      
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: data
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };
};

// Update transaction
export const updateTransaction = (transaction) => {
  return async dispatch => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions/${transaction._id}`,
        transaction,
        getConfig()
      );
      
      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: data
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };
};

// Delete transaction
export const deleteTransaction = (id) => {
  return async dispatch => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}`, getConfig());
      
      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };
};

// Set current transaction
export const setCurrentTransaction = (id) => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}`, getConfig());
        console.log('Fetched transaction from backend:', data);

      dispatch({
        type: 'SET_CURRENT_TRANSACTION',
        payload: data
      });
    } catch (error) {
      console.error('Error fetching transaction:', error);
    }
  };
};