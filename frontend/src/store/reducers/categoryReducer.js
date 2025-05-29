const initialState = {
  categories: [
    { id: 'c-1', name: 'Food', icon: 'utensils', color: '#10B981' },
    { id: 'c-2', name: 'Rent', icon: 'home', color: '#3B82F6' },
    { id: 'c-3', name: 'Utilities', icon: 'plug', color: '#8B5CF6' },
    { id: 'c-4', name: 'Entertainment', icon: 'film', color: '#EC4899' },
    { id: 'c-5', name: 'Shopping', icon: 'shopping-bag', color: '#F59E0B' },
    { id: 'c-6', name: 'Transportation', icon: 'car', color: '#6366F1' },
    { id: 'c-7', name: 'Healthcare', icon: 'heart', color: '#EF4444' },
    { id: 'c-8', name: 'Education', icon: 'book', color: '#0EA5E9' },
    { id: 'c-9', name: 'Income', icon: 'dollar-sign', color: '#10B981' }
  ],
  loading: false,
  error: null
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CATEGORIES_SUCCESS':
      return {
        ...state,
        loading: false,
        categories: action.payload
      };
    case 'FETCH_CATEGORIES_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default categoryReducer;