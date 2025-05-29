const initialState = {
  transactions: [],
  loading: false,
  error: null,
  currentTransaction: null
};

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TRANSACTIONS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_TRANSACTIONS_SUCCESS':
      return {
        ...state,
        loading: false,
        transactions: action.payload
      };
    case 'FETCH_TRANSACTIONS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction._id === action.payload._id ? action.payload : transaction
        )
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction._id !== action.payload)
      };
    case 'SET_CURRENT_TRANSACTION':
      return {
        ...state,
        currentTransaction: action.payload
      };
    default:
      return state;
  }
};

export default transactionReducer;