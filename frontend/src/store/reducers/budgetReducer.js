const initialState = {
  budgets: [],
  loading: false,
  error: null
};

const budgetReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_BUDGETS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_BUDGETS_SUCCESS':
      return {
        ...state,
        loading: false,
        budgets: action.payload
      };
    case 'FETCH_BUDGETS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload]
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget => 
          budget._id === action.payload._id ? action.payload : budget
        )
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget._id !== action.payload)
      };
    default:
      return state;
  }
};

export default budgetReducer;